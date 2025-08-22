from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .routers import users, chat, streaming, profile, payment, analytics, polls
from .database import init_db
import asyncio
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SkyNet Chat API 🌌🤖")

# CORS untuk Railway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://<your-frontend-domain>.up.railway.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(chat.router)
app.include_router(streaming.router)
app.include_router(profile.router)
app.include_router(payment.router)
app.include_router(analytics.router)
app.include_router(polls.router)

init_db()

# WebSocket
clients = {}

async def broadcast(channel: str, message: str, username: str, private: bool = False, priority: bool = False):
    if channel in clients:
        for client_username, ws in clients[channel].items():
            try:
                await ws.send_json({"type": "message", "channel": channel, "username": username, "message": message, "private": private, "priority": priority})
            except Exception as e:
                logger.error(f"Broadcast error: {e}")

async def handle_connection(websocket: WebSocket, channel: str, username: str):
    await websocket.accept()
    if channel not in clients:
        clients[channel] = {}
    clients[channel][username] = websocket
    logger.info(f"{username} joined channel {channel}")
    try:
        await broadcast(channel, f"{username} bergabung ke channel! 🏁", username)
        async for message in websocket:
            data = message.json() if isinstance(message, str) else message
            if data.get("type") == "message":
                await broadcast(data["channel"], data["message"], data["username"], data.get("private", False), data.get("priority", False))
    except WebSocketDisconnect:
        del clients[channel][username]
        if not clients[channel]:
            del clients[channel]
        await broadcast(channel, f"{username} meninggalkan channel! 🏁", username)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting server on port {os.environ.get('PORT', 'default')}")
    # WebSocket server (opsional, aktifkan jika stabil)
    # asyncio.create_task(websockets.serve(handle_connection, "0.0.0.0", 8765))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
