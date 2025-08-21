from fastapi import APIRouter, HTTPException, Depends
from ...models import Message, Donation
from ...database import get_user_id
from ...auth import get_current_user
from ...crypto import encrypt_message
import stripe
import sqlite3
import time
from .main import broadcast

router = APIRouter(prefix="/chat", tags=["chat"])

stripe.api_key = "sk_test_..."  # Ganti dengan Stripe key

@router.post("/message")
async def send_message(message: Message, username: str = Depends(get_current_user)):
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found! ❌")
    encrypted = encrypt_message(message.message, "skynet-key")
    conn = sqlite3.connect('skynet_chat.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO messages (channel, user_id, username, message, timestamp, private, priority) VALUES (?, ?, ?, ?, ?, ?, ?)",
                  (message.channel, user_id, username, encrypted, time.time(), message.private, False))
    conn.commit()
    conn.close()
    await broadcast(message.channel, f"{username}: {message.message}", username, message.private)
    return {"message": "Pesan terkirim! ✅"}

@router.post("/donation")
async def process_donation(donation: Donation, username: str = Depends(get_current_user)):
    user_id = get_user_id(username)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found! ❌")
    try:
        intent = stripe.PaymentIntent.create(
            amount=donation.amount * 100,
            currency="usd",
            metadata={"channel": donation.channel, "donor": username, "request": donation.message}
        )
        conn = sqlite3.connect('skynet_chat.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO messages (channel, user_id, username, message, timestamp, private, priority) VALUES (?, ?, ?, ?, ?, ?, ?)",
                      (donation.channel, user_id, username, f"[SAWER ${donation.amount}] {donation.message}", time.time(), False, True))
        conn.commit()
        conn.close()
        await broadcast(donation.channel, f"[SAWER ${donation.amount} dari {username}] {donation.message}", username, private=False, priority=True)
        return {"client_secret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
