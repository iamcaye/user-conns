import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Database:
    def __init__(self, host: str = "", port: int = "", user: str = "", password: str = "", database: str = ""):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.database = database
        self._conn_str = None

    def init_from_env(self):
        self.database = os.getenv("DB_NAME")
        self.host = os.getenv("DB_HOST")
        self.port = int(os.getenv("DB_PORT"))
        self.user = os.getenv("DB_USER")
        self.password = os.getenv("DB_PASSWORD")
        return self

    def get_conn_str(self, sql_driver: str = "postgresql"):
        if self._conn_str is None:
            if sql_driver == "postgresql":
                self._conn_str = f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"

        return self._conn_str

    def get_engine(self):
        return create_engine(self.get_conn_str())

    def get_session(self):
        engine = self.get_engine()
        session = sessionmaker(bind=engine)
        return session()

    def create_database(self):
        engine = self.get_engine()
        from backend.entities.users import User, UserLocations, UserPictures, UserConnections
        Base.metadata.create_all(engine)

    def close(self):
        self.get_session().close()

    def __str__(self) -> str:
        return f"Database: {self.database}, User: {self.user}, Host: {self.host}, Port: {self.port}"


def get_db(initialize: bool = True):
    db = None
    try:
        print("Creating database connection")
        database = Database().init_from_env()
        db = database.get_session()

        yield db
    finally:
        print("Closing database connection")
        db.close()
