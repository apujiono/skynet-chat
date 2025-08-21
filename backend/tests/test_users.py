import pytest
from fastapi.testclient import TestClient
from ..app.main import app

client = TestClient(app)

def test_register():
    response = client.post("/users/register", json={"username": "testuser", "password": "testpass", "status": "Online", "role": "user"})
    assert response.status_code == 200
    assert "token" in response.json()
