from pydantic import BaseModel


class Base(BaseModel):
    def __repr__(self) -> str:
        attrs = []
        for k, v in self.__class__.schema().items():
            attrs.append(f"{k}={v}")
        return "{}({})".format(self.__class__.__name__, ', '.join(attrs))

    class Config:
        orm_mode = True


class UserBase(Base):
    username: str
    email: str
    name: str
    last_name: str
    dob: str
    gender: str


class UserCreateLocation(Base):
    state: str
    city: str
    country: str


class UserCreate(UserBase):
    password: str
    state: str
    city: str
    country: str
    country_code: str
    url_picture: str = None


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


class UserLogin(Base):
    username: str
    password: str
