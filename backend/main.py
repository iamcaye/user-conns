#!/usr/bin/python3.11
from fastapi import FastAPI
from backend.router.users import router as users_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.config.database import Database

load_dotenv()

db = Database().init_from_env()
db.create_database()
db.close()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(users_router)
