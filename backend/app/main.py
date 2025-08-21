from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routers import users, chat, streaming, profile, payment, analytics, polls
from .database import init_db
import asyncio
import json
import websockets

app = FastAPI(title="SkyNet Chat API 🌌🤖")

# Mount frontend (untuk hosting lokal, di Replit gunakan repl terpisah)
app.mount("/frontend", StaticFiles(directory="../frontend/build"), name="frontend")

# CORS untuk Replit
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://skynet-chat-frontend.your-username.repl.co", "*"],
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

# WebSocket (dinonaktifkan di Replit free tier, gunakan polling)
clients = {}

async def broadcast(channel: str, message: str, username: str, private: bool = False, priority: bool = False):
    if channel in clients:
        for client_username, ws in clients[channel].items():
            try:
                await ws.send_json({"type": "message", "channel": channel, "username": username, "message": message, "private": private, "priority": priority})
            except:
                pass

async def handle_connection(websocket: WebSocket, channel: str, username: str):
    await websocket.accept()
    if channel not in clients:
        clients[channel] = {}
    clients[channel][username] = websocket
    try:
        await broadcast(channel, f"{username} bergabung ke channel! 🏁", username)
        async for message in websocket:
            data = json.loads(message)
            if data["type"] == "message":
                await broadcast(data["channel"], data["message"], data["username"], data.get("private", False), data.get("priority", False))
    except WebSocketDisconnect:
        del clients[channel][username]
        if not clients[channel]:
            del clients[channel]
        await broadcast(channel, f"{username} meninggalkan channel! 🏁", username)

# Nonaktifkan WebSocket di Replit free tier
# @app.on_event("startup")
# async def startup_event():
#     asyncio.create_task(websockets.serve(handle_connection, "0.0.0.0", 8765))
