from pydantic import BaseModel

class UserRegister(BaseModel):
    username: str
    password: str
    status: str = "Online"
    role: str = "user"

class UserLogin(BaseModel):
    username: str
    password: str

class Message(BaseModel):
    channel: str
    message: str
    private: bool = False

class Donation(BaseModel):
    amount: int
    message: str
    channel: str

class Gift(BaseModel):
    gift_type: str
    diamond_cost: int
    channel: str

class Stream(BaseModel):
    channel: str
    title: str
    is_private: bool = False

class Poll(BaseModel):
    channel: str
    question: str
    options: list[str]
