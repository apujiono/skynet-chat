from fastapi import HTTPException
from python_socks.async_ import Proxy
from python_socks import ProxyType

async def route_through_tor():
    try:
        proxy = Proxy.create(
            proxy_type=ProxyType.SOCKS5,
            host='localhost',
            port=9050
        )
        return proxy
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tor connection failed: {str(e)}")
