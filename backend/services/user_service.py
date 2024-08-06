from sqlalchemy.orm import Session, joinedload
from backend.entities.users import User, UserLocations
from backend.models.user import FullUser, UserLogin, UserCreate
import requests


class UserService:
    def __init__(self):
        pass

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
                                     dob=user["dob"]["date"], password="password",
                                     state=user["location"]["state"], city=user["location"]["city"],
                                     country=user["location"]["country"], country_code=user["nat"])
            db_user = User(random_user)
            UserService.create_user(db, db_user)
            users.append(db_user)

        return users

    # page and page_size are optional
    @staticmethod
    def get_suggestions(page: int = 0, page_size: int = 10, db: Session = None) -> list[User]:
        users = db.query(User).options(joinedload(User.location)).offset(page * page_size).limit(page_size).all()
        print(f"Users: {len(users)}")
        if users is None or len(users) < page_size:
            UserService._random_users(db, page_size - len(users))
            return UserService.get_suggestions(page, page_size, db)
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
