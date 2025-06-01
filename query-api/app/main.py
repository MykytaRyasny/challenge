from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from app.routes import router
from brotli_asgi import BrotliMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from fastapi.requests import Request

app = FastAPI()

limiter = Limiter(key_func=get_remote_address, default_limits=["15/minute"])
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded. Please try again later."})

app.add_middleware(BrotliMiddleware, quality=5, minimum_size=10000)
app.add_middleware(GZipMiddleware, minimum_size=10000)
app.include_router(router)