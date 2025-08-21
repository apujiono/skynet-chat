from fastapi import APIRouter, Depends
from ...auth import get_current_user
from ...database import get_user_id
import sqlite3

router = APIRouter(prefix="/profile", tags=["profile"])

@router.post("/update")
async def update_profile(status: str, username: str = Depends(get_current_user)):
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found! ❌")
    conn = sqlite3.connect('skynet_chat.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET status = ? WHERE username = ?", (status, username))
    conn.commit()
    conn.close()
    return {"message": f"Profile updated for {username}! ✅"}
