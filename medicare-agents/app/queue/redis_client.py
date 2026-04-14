"""Redis queue helpers for the Medicare Agents service."""

import json
import uuid
from datetime import datetime

import redis.asyncio as aioredis

from app.config import settings

__all__ = ["RedisClient", "enqueue_task", "dequeue_task", "get_task_status"]

# Module-level singleton — initialised lazily on first use.
_redis_client: aioredis.Redis | None = None


def _get_client() -> aioredis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_client


class RedisClient:
    """Thin wrapper exposing queue operations via instance methods."""

    def __init__(self) -> None:
        self._client: aioredis.Redis = _get_client()

    async def enqueue_task(self, queue_name: str, payload: dict) -> str:
        return await enqueue_task(queue_name, payload)

    async def dequeue_task(self, queue_name: str) -> dict | None:
        return await dequeue_task(queue_name)

    async def get_task_status(self, task_id: str) -> dict | None:
        return await get_task_status(task_id)

    async def queue_length(self, queue_name: str) -> int:
        return await self._client.llen(queue_name)

    async def ping(self) -> bool:
        try:
            return await self._client.ping()
        except Exception:
            return False


async def enqueue_task(queue_name: str, payload: dict) -> str:
    """Append a task to *queue_name* and return its task_id.

    Stores metadata under ``task:{task_id}`` key in Redis so callers can
    retrieve status later via :func:`get_task_status`.
    """
    client = _get_client()
    task_id = str(uuid.uuid4())
    task_data: dict = {
        "task_id": task_id,
        "queue": queue_name,
        "payload": payload,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
    }
    serialised = json.dumps(task_data)
    # Push to the right end of the list (RPUSH); workers pop from the left (BLPOP/LPOP).
    await client.rpush(queue_name, serialised)
    # Store task metadata with a 24-hour TTL.
    await client.set(f"task:{task_id}", serialised, ex=86_400)
    return task_id


async def dequeue_task(queue_name: str) -> dict | None:
    """Pop the oldest task from *queue_name* (non-blocking).

    Returns the deserialised task dict, or ``None`` if the queue is empty.
    Updates the stored task status to ``"processing"``.
    """
    client = _get_client()
    raw: str | None = await client.lpop(queue_name)
    if raw is None:
        return None
    task_data: dict = json.loads(raw)
    task_data["status"] = "processing"
    await client.set(
        f"task:{task_data['task_id']}",
        json.dumps(task_data),
        ex=86_400,
    )
    return task_data


async def get_task_status(task_id: str) -> dict | None:
    """Return the task metadata dict for *task_id*, or ``None`` if not found."""
    client = _get_client()
    raw: str | None = await client.get(f"task:{task_id}")
    if raw is None:
        return None
    return json.loads(raw)
