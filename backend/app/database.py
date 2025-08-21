import sqlite3
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, MetaData, Table
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///skynet_chat.db")
metadata = MetaData()

users = Table(
    'users', metadata,
    Column('id', Integer, primary_key=True),
    Column('username', String, unique=True),
    Column('password', String),
    Column('status', String),
    Column('role', String)
)

messages = Table(
    'messages', metadata,
    Column('id', Integer, primary_key=True),
    Column('channel', String),
    Column('user_id', Integer),
    Column('username', String),
    Column('message', String),
    Column('timestamp', Float),
    Column('private', Boolean),
    Column('priority', Boolean)
)

streams = Table(
    'streams', metadata,
    Column('id', Integer, primary_key=True),
    Column('channel', String),
    Column('user_id', Integer),
    Column('username', String),
    Column('title', String),
    Column('is_private', Boolean),
    Column('timestamp', Float)
)

gifts = Table(
    'gifts', metadata,
    Column('id', Integer, primary_key=True),
    Column('channel', String),
    Column('user_id', Integer),
    Column('username', String),
    Column('gift_type', String),
    Column('diamond_cost', Integer),
    Column('timestamp', Float)
)

vods = Table(
    'vods', metadata,
    Column('id', Integer, primary_key=True),
    Column('username', String),
    Column('ipfs_hash', String),
    Column('timestamp', Float)
)

polls = Table(
    'polls', metadata,
    Column('id', Integer, primary_key=True),
    Column('channel', String),
    Column('question', String),
    Column('options', String),  # JSON string
    Column('timestamp', Float)
)

logs = Table(
    'logs', metadata,
    Column('id', Integer, primary_key=True),
    Column('user_id', Integer),
    Column('action', String),
    Column('timestamp', Float)
)

def init_db():
    metadata.create_all(engine)

def get_user_id(username: str) -> int:
    conn = sqlite3.connect('skynet_chat.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else None
