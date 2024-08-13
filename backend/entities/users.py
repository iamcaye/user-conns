from backend.config.database import Base
from sqlalchemy.orm import relationship
from typing import List
from sqlalchemy.orm import Mapped
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from backend.models.user import UserCreate
from sqlalchemy.schema import UniqueConstraint
from datetime import datetime


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    last_name = Column(String)
    dob = Column(DateTime)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    gender = Column(String)

    id_location = Column(Integer, ForeignKey("user_locations.id"))
    location = relationship("UserLocations", back_populates="user", uselist=False)
    pictures = relationship("UserPictures", back_populates="user")
    connections = relationship("UserConnections", back_populates="user", foreign_keys="UserConnections.id_user")

    def __init__(self, user: UserCreate) -> None:
        self.name = user.name
        self.last_name = user.last_name
        self.dob = user.dob
        self.username = user.username
        self.email = user.email
        self.gender = user.gender
        self.location = UserLocations(city=user.city, state=user.state, country=user.country, country_code=user.country_code)
        self.pictures = [UserPictures(url=user.url_picture)]

    def __str__(self) -> str:
        return f"User: {self.name} {self.last_name}, Username: {self.username}, Email: {self.email}, Location: {self.location}"


class UserLocations(Base):
    __tablename__ = "user_locations"
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    country_code = Column(String)

    # unique index to prevent duplicate locations
    __table_args__ = (UniqueConstraint("city", "state", "country"),)

    user = relationship("User", back_populates="location")

    def __init__(self, city: str, state: str, country: str, country_code: str) -> None:
        self.city = city
        self.state = state
        self.country = country
        self.country_code = country_code

    def __str__(self) -> str:
        return f"Location: {self.city}, {self.state}, {self.country} ({self.country_code})"


class UserPictures(Base):
    __tablename__ = "user_pictures"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    id_user = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="pictures")

    def __init__(self, url: str) -> None:
        self.url = url

    def __str__(self) -> str:
        return f"Picture: {self.url}"


class UserConnections(Base):
    __tablename__ = "user_connections"
    id_user = Column(Integer, ForeignKey("users.id"), primary_key=True)
    id_connection = Column(Integer, ForeignKey("users.id"), primary_key=True)
    connected_at = Column(DateTime, default=datetime.now)

    user = relationship("User", foreign_keys=[id_user], back_populates="connections")
    connection = relationship("User", foreign_keys=[id_connection])

    def __init__(self, id_user: int, id_connection: int) -> None:
        self.id_user = id_user
        self.id_connection = id_connection

    def __str__(self) -> str:
        return f"Connection: {self.id_user} -> {self.id_connection}"
