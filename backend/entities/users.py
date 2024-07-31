from backend.config.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from backend.models.user import UserCreate


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    last_name = Column(String)
    dob = Column(DateTime)
    username = Column(String, unique=True)
    email = Column(String, unique=True)

    id_location = Column(Integer, ForeignKey("user_locations.id"))
    location = relationship("UserLocations", back_populates="user", uselist=False)

    def __init__(self, user: UserCreate) -> None:
        self.name = user.name
        self.last_name = user.last_name
        self.dob = user.dob
        self.username = user.username
        self.email = user.email
        self.location = UserLocations(city=user.city, state=user.state, country=user.country)

    def __str__(self) -> str:
        return f"User: {self.name} {self.last_name}, Username: {self.username}, Email: {self.email}, Location: {self.location}"


class UserLocations(Base):
    __tablename__ = "user_locations"
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String)
    state = Column(String)
    country = Column(String)

    user = relationship("User", back_populates="location")

    def __init__(self, city: str, state: str, country: str) -> None:
        self.city = city
        self.state = state
        self.country = country

    def __str__(self) -> str:
        return f"Location: {self.city}, {self.state}, {self.country}"
