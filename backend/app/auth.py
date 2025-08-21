from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import jwt
from datetime import datetime, timedelta
from .database import get_user_id

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")
SECRET_KEY = "skynet-anon-2025"

def generate_anon_keypair():
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()
    return private_key, public_key

def create_anon_token(username: str):
    private_key, public_key = generate_anon_keypair()
    to_encode = {"sub": username, "exp": datetime.utcnow() + timedelta(hours=24)}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")  # Simplified for demo
    return token, public_key

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload["sub"]
        if not get_user_id(username):
            raise HTTPException(status_code=401, detail="User not found")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
