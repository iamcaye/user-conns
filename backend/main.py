#!/usr/bin/python3.11
from fastapi import FastAPI
from backend.router.users import router as users_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(users_router)
