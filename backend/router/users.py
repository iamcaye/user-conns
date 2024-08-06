# import router from fastapi
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.config.database import get_db
from backend.models.user import UserCreate, UserLogin
from backend.services.user_service import UserService
from backend.entities.users import User

from fastapi import HTTPException

router = APIRouter(prefix="/api/users", tags=["users"])

# exception


@router.get("/")
def read_users(db: Session = Depends(get_db)):
    return UserService.get_full_users(db)


@router.get("/suggestions")
def get_suggestions(page: int = 0, page_size: int = 10, db: Session = Depends(get_db)):
    return UserService.get_suggestions(page, page_size, db)


@router.get("/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    return UserService.get_user_by_id(db, user_id)


@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserService.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Failed to create user")

    new_user = User(user)

    return UserService.create_user(db, new_user)


@router.put("/{user_id}")
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    return UserService.update_user(db, user_id, user)


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    logged_user = UserService.login(user, db)
    if not logged_user:
        raise HTTPException(status_code=401, detail="Failed to login")

    return logged_user
