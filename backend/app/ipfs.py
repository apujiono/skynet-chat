import ipfshttpclient
from fastapi import HTTPException

def upload_to_ipfs(file_content: bytes) -> str:
    try:
        client = ipfshttpclient.connect('/ip4/127.0.0.1/tcp/5001')
        res = client.add_bytes(file_content)
        return res['Hash']
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"IPFS upload failed: {str(e)}")

def get_from_ipfs(hash: str) -> bytes:
    try:
        client = ipfshttpclient.connect('/ip4/127.0.0.1/tcp/5001')
        return client.cat(hash)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"IPFS retrieve failed: {str(e)}")
