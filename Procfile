web: uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
worker: python -m websockets ws://0.0.0.0:8765
