from sqlalchemy.orm import Session, joinedload
from backend.entities.users import User, UserLocations
from backend.models.user import FullUser


class UserService:
    def __init__(self):
        pass

    @staticmethod
    def get_users(db: Session) -> list[User]:
        return db.query(User).all()

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
