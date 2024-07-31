from backend.config.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    last_name = Column(String)
    dob = Column(DateTime)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    uid = Column(String, unique=True, server_default=func.uuid_generate_v4())

    id_location = Column(Integer, ForeignKey("user_locations.id"))
    location = relationship("UserLocations", back_populates="user", uselist=False)

    def __str__(self) -> str:
        return f"User: {self.name} {self.last_name}, Username: {self.username}, Email: {self.email}, Location: {self.location}"


class UserLocations(Base):
    __tablename__ = "user_locations"
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String)
    state = Column(String)
    country = Column(String)

    user = relationship("User", back_populates="location")

    def __str__(self) -> str:
        return f"Location: {self.city}, {self.state}, {self.country}"
