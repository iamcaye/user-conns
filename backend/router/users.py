# import router from fastapi
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.config.database import get_db
from backend.models.user import UserCreate
from backend.services.user_service import UserService

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/")
def read_users(db: Session = Depends(get_db)):
    return UserService.get_full_users(db)


@router.get("/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    return UserService.get_user_by_id(db, user_id)


@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserService.find_user_by_username(db, user.username)
    if db_user:
        return {"error": "Username already exists"}

    return UserService.create_user(db, user)


@router.put("/{user_id}")
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    return UserService.update_user(db, user_id, user)
