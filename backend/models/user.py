from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    email: str
    name: str
    last_name: str
    dob: str


class UserCreateLocation(BaseModel):
    state: str
    city: str
    country: str


class UserCreate(UserBase):
    password: str
    location: UserCreateLocation


class UserUpdate(UserBase):
    id: int
    password: str
    location: UserCreateLocation


class UserModel(UserBase):
    id: int


class UserLocation(UserModel):
    state: str
    city: str
    country: str


class FullUser(UserModel):
    location: UserLocation
