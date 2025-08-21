from fastapi import APIRouter, HTTPException, Depends, WebSocket
from ...auth import get_current_user
from ...models import Gift, Stream
from ...database import get_user_id
from ...ipfs import upload_to_ipfs
from fastapi import UploadFile
import stripe
import sqlite3
import time
from .main import broadcast

router = APIRouter(prefix="/streaming", tags=["streaming"])

stripe.api_key = "sk_test_..."  # Ganti dengan Stripe key

@router.post("/start")
async def start_stream(stream: Stream, username: str = Depends(get_current_user)):
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found! ❌")
    conn = sqlite3.connect('skynet_chat.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO streams (channel, user_id, username, title, is_private, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                  (stream.channel, user_id, username, stream.title, stream.is_private, time.time()))
    conn.commit()
    conn.close()
    await broadcast(stream.channel, f"{username} memulai live streaming: {stream.title} 📹", username)
    return {"message": "Stream dimulai! ✅"}

@router.post("/gift")
async def send_gift(gift: Gift, username: str = Depends(get_current_user)):
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found! ❌")
    try:
        intent = stripe.PaymentIntent.create(
            amount=gift.diamond_cost * 100,
            currency="usd",
            metadata={"channel": gift.channel, "donor": username, "gift_type": gift.gift_type}
        )
        conn = sqlite3.connect('skynet_chat.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO gifts (channel, user_id, username, gift_type, diamond_cost, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                      (gift.channel, user_id, username, gift.gift_type, gift.diamond_cost, time.time()))
        conn.commit()
        conn.close()
        await broadcast(gift.channel, f"[GIFT {gift.gift_type} ${gift.diamond_cost}] dari {username}", username, private=False, priority=True)
        return {"client_secret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/upload-vod")
async def upload_vod(file: UploadFile, username: str = Depends(get_current_user)):
    content = await file.read()
    ipfs_hash = upload_to_ipfs(content)
    conn = sqlite3.connect('skynet_chat.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO vods (username, ipfs_hash, timestamp) VALUES (?, ?, ?)",
                  (username, ipfs_hash, time.time()))
    conn.commit()
    conn.close()
    return {"ipfs_hash": ipfs_hash}
