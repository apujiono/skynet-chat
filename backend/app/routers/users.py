from fastapi import APIRouter, HTTPException
from ...models import UserRegister, UserLogin
from ...database import get_user_id, hash_password, check_password
from ...auth import create_anon_token
import sqlite3
import time

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register")
async def register(user: UserRegister):
    hashed_pw = hash_password(user.password)
    conn = sqlite3.connect('skynet_chat.db')
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password, status, role) VALUES (?, ?, ?, ?)",
                      (user.username, hashed_pw, user.status, user.role))
        user_id = get_user_id(user.username)
        cursor.execute("INSERT INTO logs (user_id, action, timestamp) VALUES (?, ?, ?)",
                      (user_id, "register", time.time()))
        conn.commit()
        conn.close()
        token, _ = create_anon_token(user.username)
        return {"message": f"User {user.username} registered anonymously! 🚀", "token": token}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists! ❌")
