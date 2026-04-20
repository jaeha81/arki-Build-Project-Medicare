"""LINE Messaging API Webhook — receives events and sends automated messages."""

import hashlib
import hmac
import json
import logging
import os
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Header, HTTPException, Request

__all__: list[str] = []

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/line", tags=["line"])

_LINE_CHANNEL_SECRET = os.getenv("LINE_CHANNEL_SECRET", "")
_LINE_CHANNEL_ACCESS_TOKEN = os.getenv("LINE_CHANNEL_ACCESS_TOKEN", "")
_LINE_API_BASE = "https://api.line.me/v2/bot"


# ---------------------------------------------------------------------------
# Signature verification
# ---------------------------------------------------------------------------


def _verify_signature(body: bytes, x_line_signature: str) -> bool:
    """Verify LINE webhook signature using HMAC-SHA256."""
    if not _LINE_CHANNEL_SECRET:
        return True  # skip in local dev
    mac = hmac.new(
        _LINE_CHANNEL_SECRET.encode("utf-8"),
        body,
        hashlib.sha256,
    )
    expected = mac.digest()
    import base64
    return hmac.compare_digest(base64.b64encode(expected).decode(), x_line_signature)


# ---------------------------------------------------------------------------
# LINE push message helper
# ---------------------------------------------------------------------------


async def push_message(to: str, messages: list[dict]) -> None:
    """Push messages to a LINE user (fire-and-forget safe)."""
    if not _LINE_CHANNEL_ACCESS_TOKEN:
        logger.warning("LINE_CHANNEL_ACCESS_TOKEN not set — skipping push")
        return
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{_LINE_API_BASE}/message/push",
            headers={
                "Authorization": f"Bearer {_LINE_CHANNEL_ACCESS_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"to": to, "messages": messages},
            timeout=10,
        )
        if resp.status_code != 200:
            logger.error("LINE push failed: %s %s", resp.status_code, resp.text)


async def reply_message(reply_token: str, messages: list[dict]) -> None:
    """Reply to a LINE event using the reply token."""
    if not _LINE_CHANNEL_ACCESS_TOKEN:
        return
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{_LINE_API_BASE}/message/reply",
            headers={
                "Authorization": f"Bearer {_LINE_CHANNEL_ACCESS_TOKEN}",
                "Content-Type": "application/json",
            },
            json={"replyToken": reply_token, "messages": messages},
            timeout=10,
        )


# ---------------------------------------------------------------------------
# Auto-message builders
# ---------------------------------------------------------------------------


def consultation_complete_message(patient_name: str, available_dates: list[str]) -> list[dict]:
    """Build an appointment availability message after consultation submission."""
    dates_text = "\n".join(f"・{d}" for d in available_dates[:3])
    return [
        {
            "type": "text",
            "text": (
                f"{patient_name}様、問診票のご送信ありがとうございます。\n\n"
                f"ご予約可能な日程をご案内します：\n{dates_text}\n\n"
                "ご希望の日時をお知らせください。"
            ),
        }
    ]


def prescription_issued_message(
    patient_name: str,
    drug_name: str,
    dosage: str,
    instructions: str | None,
) -> list[dict]:
    """Build a prescription notification card message."""
    body = f"お薬名：{drug_name}\n用量：{dosage}"
    if instructions:
        body += f"\n服用方法：{instructions}"
    return [
        {
            "type": "flex",
            "altText": f"処方箋が発行されました：{drug_name}",
            "contents": {
                "type": "bubble",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "処方箋のお知らせ",
                            "weight": "bold",
                            "color": "#ffffff",
                            "size": "md",
                        }
                    ],
                    "backgroundColor": "#14685a",
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": f"{patient_name}様",
                            "weight": "bold",
                            "size": "lg",
                        },
                        {
                            "type": "text",
                            "text": body,
                            "wrap": True,
                            "margin": "md",
                            "size": "sm",
                            "color": "#555555",
                        },
                    ],
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "ご不明点はメッセージでお問い合わせください。",
                            "size": "xs",
                            "color": "#aaaaaa",
                            "wrap": True,
                        }
                    ],
                },
            },
        }
    ]


def medication_reminder_message(patient_name: str, drug_name: str, dosage: str) -> list[dict]:
    """Build a daily medication reminder message."""
    return [
        {
            "type": "text",
            "text": (
                f"{patient_name}様、おはようございます。\n"
                f"本日の服薬リマインダーです。\n\n"
                f"お薬：{drug_name}\n用量：{dosage}\n\n"
                "服用をお忘れなく。"
            ),
        }
    ]


# ---------------------------------------------------------------------------
# Webhook endpoint
# ---------------------------------------------------------------------------


@router.post("/webhook")
async def line_webhook(
    request: Request,
    x_line_signature: str = Header(default=""),
) -> dict:
    """Receive LINE Messaging API webhook events."""
    body_bytes = await request.body()

    if not _verify_signature(body_bytes, x_line_signature):
        raise HTTPException(status_code=400, detail="Invalid LINE signature")

    try:
        payload = json.loads(body_bytes)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    for event in payload.get("events", []):
        await _handle_event(event)

    return {"status": "ok"}


async def _handle_event(event: dict) -> None:
    """Dispatch a single LINE event."""
    event_type = event.get("type")
    source = event.get("source", {})
    line_user_id = source.get("userId", "")
    reply_token = event.get("replyToken", "")

    if event_type == "follow":
        # User added the bot as a friend
        await reply_message(
            reply_token,
            [
                {
                    "type": "text",
                    "text": (
                        "Medipicへようこそ！\n"
                        "オンライン診療・処方のご利用をお手伝いします。\n"
                        "ご不明な点はいつでもメッセージでお知らせください。"
                    ),
                }
            ],
        )
        logger.info("Follow event from user %s", line_user_id)

    elif event_type == "message":
        msg = event.get("message", {})
        if msg.get("type") == "text":
            text = msg.get("text", "").strip()
            logger.info("Message from %s: %s", line_user_id, text)
            # Respond to common keywords
            if any(kw in text for kw in ["処方", "薬", "prescription"]):
                await reply_message(
                    reply_token,
                    [{"type": "text", "text": "処方箋についてはMedipicアプリでご確認いただけます。"}],
                )
            elif any(kw in text for kw in ["予約", "appointment", "書き直し"]):
                await reply_message(
                    reply_token,
                    [{"type": "text", "text": "ご予約はMedipicアプリからお申し込みください。"}],
                )

    elif event_type == "postback":
        logger.info("Postback from %s: %s", line_user_id, event.get("postback", {}).get("data"))


# ---------------------------------------------------------------------------
# Internal notification helpers (called from other routers)
# ---------------------------------------------------------------------------


async def notify_consultation_complete(
    line_user_id: str,
    patient_name: str,
    available_dates: list[str] | None = None,
) -> None:
    """Push a consultation-complete message with available appointment dates."""
    if available_dates is None:
        today = datetime.now(timezone.utc)
        available_dates = [
            f"{today.strftime('%Y-%m-%d')} 10:00",
            f"{today.strftime('%Y-%m-%d')} 14:00",
            f"{today.strftime('%Y-%m-%d')} 16:00",
        ]
    await push_message(line_user_id, consultation_complete_message(patient_name, available_dates))


async def notify_prescription_issued(
    line_user_id: str,
    patient_name: str,
    drug_name: str,
    dosage: str,
    instructions: str | None = None,
) -> None:
    """Push a prescription-issued card to the patient."""
    await push_message(
        line_user_id,
        prescription_issued_message(patient_name, drug_name, dosage, instructions),
    )
