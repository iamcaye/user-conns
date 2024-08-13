from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from backend.entities.users import User, UserLocations, UserConnections
from backend.models.user import FullUser, UserLogin, UserCreate
import requests


class UserService:
    def __init__(self):
        pass

    @staticmethod
    def _random_users(db: Session, quantity: int) -> list[User]:
        print("Getting random users")
        r = requests.get(f"https://randomuser.me/api/?results={quantity}")
        users = []
        if r.status_code != 200:
            return users
        results = r.json()["results"]
        for user in results:
            random_user = UserCreate(name=user["name"]["first"], last_name=user["name"]["last"],
                                     username=user["login"]["username"], email=user["email"],
                                     dob=user["dob"]["date"], password="password", gender=user["gender"],
                                     state=user["location"]["state"], city=user["location"]["city"],
                                     country=user["location"]["country"], country_code=user["nat"], url_picture=user["picture"]["large"])
            db_user = User(random_user)
            UserService.create_user(db, db_user)
            users.append(db_user)

        return users

    # page and page_size are optional
    @staticmethod
    def get_suggestions(user_id: int, page: int = 0, page_size: int = 10, db: Session = None) -> list[User]:
        user_connections = db.query(UserConnections).filter(UserConnections.id_user == user_id).all()
        users = db.query(User).options(
            joinedload(User.location), joinedload(User.pictures)
        ).where(
            and_(
                User.id != user_id,
                ~User.id.in_([conn.id_connection for conn in user_connections])
            )
        ).offset(page * page_size).limit(page_size).all()

        print(f"Users: {len(users)}")
        if users is None or len(users) < page_size:
            res_user = UserService._random_users(db, page_size - len(users))
            if res_user is None or len(res_user) == 0:
                return []
            users = UserService.get_suggestions(user_id, page, page_size, db)
            return users
        return users

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> User:
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def create_user(db: Session, user: User) -> User:
        location = db.query(UserLocations).filter(UserLocations.city == user.location.city).first()
        if location is None:
            db.add(user.location)
            db.commit()
            db.refresh(user.location)
        else:
            user.location = location

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def update_user(db: Session, user: User) -> User:
        db.merge(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete_user(db: Session, user: User) -> User:
        db.delete(user)
        db.commit()
        return user

    @staticmethod
    def get_full_users(db: Session) -> list[FullUser]:
        return db.query(User).options(joinedload(User.location)).all()

    @staticmethod
    def login(user: UserLogin, db: Session) -> FullUser:
        return db.query(User).options(joinedload(User.location)).filter(User.username == user.username).first()

    @staticmethod
    def connect_user(db: Session, user: User, connection: User) -> User:
        user_conn = UserConnections(id_user=user.id, id_connection=connection.id)
        user.connections.append(user_conn)
        db.commit()
        db.refresh(user)
        return user
