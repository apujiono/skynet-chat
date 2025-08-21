from fastapi import APIRouter, HTTPException, Depends
from ...auth import get_current_user
from ...models import Poll
import sqlite3
import json
from .main import broadcast

router = APIRouter(prefix="/polls", tags=["polls"])

@router.post("/create")
async def create_poll(poll: Poll, username: str = Depends(get_current_user)):
    conn = sqlite3.connect('skynet_chat.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO polls (channel, question, options, timestamp) VALUES (?, ?, ?, ?)",
                  (poll.channel, poll.question, json.dumps(poll.options), time.time()))
    conn.commit()
    conn.close()
    await broadcast(poll.channel, f"[POLL] {username} created: {poll.question} Options: {', '.join(poll.options)}", username)
    return {"message": "Poll created! ✅"}
