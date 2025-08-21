from fastapi import APIRouter, Depends
from ...auth import get_current_user
import sqlite3

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/stats")
async def get_stats(username: str = Depends(get_current_user)):
    conn = sqlite3.connect('skynet_chat.db')
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM messages WHERE username = ?", (username,))
    messages = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM gifts WHERE username = ?", (username,))
    gifts = cursor.fetchone()[0]
    conn.close()
    return {"messages_sent": messages, "gifts_received": gifts}
