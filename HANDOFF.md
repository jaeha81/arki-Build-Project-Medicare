# Medipic 작업 인수인계 (2026-04-20)

## 최신 커밋
`ca5c2e3` — 처방전 시스템 + AI 문진 강화 + LINE 연동 전체 구현

## ✅ 완료된 작업

| 기능 | 상태 | 주요 파일 |
|------|------|-----------|
| 처방전 DB 모델 | ✅ | medicare-backend/app/models/prescription.py |
| 처방전 라우터 | ✅ | medicare-backend/app/routers/v1/prescription.py |
| 카테고리별 문진 API | ✅ | medicare-backend/app/routers/v1/questionnaire.py |
| LINE Webhook | ✅ | medicare-backend/app/routers/v1/line_webhook.py |
| Prescription Agent | ✅ | medicare-agents/app/agents/prescription_agent.py |
| 카테고리 문진 컴포넌트 | ✅ | medicare-frontend/src/components/consultation/CategoryQuestions.tsx |
| 처방전 목록 페이지 | ✅ | medicare-frontend/src/app/[locale]/dashboard/prescriptions/page.tsx |
| 처방전 카드 UI | ✅ | medicare-frontend/src/components/prescription/PrescriptionCard.tsx |
| LINE 로그인 버튼 | ✅ | medicare-frontend/src/components/auth/LineLoginButton.tsx |
| LINE OAuth 라우트 | ✅ | medicare-frontend/src/app/api/auth/line/ |
| LIFF SDK 유틸 | ✅ | medicare-frontend/src/lib/liff.ts |
| 대시보드 처방전 링크 | ✅ | medicare-frontend/src/app/[locale]/dashboard/page.tsx |

## ❌ 남은 작업 (우선순위순)

### 1. Vercel 환경변수 설정 (필수)
Vercel 대시보드 → Settings → Environment Variables:
- NEXT_PUBLIC_API_URL=https://your-backend-url
- LINE_CHANNEL_ID=
- LINE_CHANNEL_SECRET=
- LINE_CHANNEL_ACCESS_TOKEN=
- LIFF_ID=

### 2. 백엔드 DB 마이그레이션
```
cd medicare-backend
alembic upgrade head   # 003_add_prescriptions 적용
```

### 3. LINE Developers Console
- Webhook URL 등록: https://your-domain.com/api/v1/line/webhook
- LIFF 앱 URL 등록: https://your-frontend-domain.com

### 4. 미구현 기능
- intake_agent.py 금기 감지 강화
- 복약 리마인더 스케줄러
- 의사 처방 발행 UI (백엔드만 완성)

## 개발 환경 시작
```
# 프론트엔드
cd medicare-frontend && npm run dev

# 백엔드
cd medicare-backend && uvicorn app.main:app --reload
```

## 핵심 패턴
- API 프록시: /api/proxy/[...path] → 백엔드 자동 라우팅 (medicare_auth 쿠키 필수)
- 다국어: [locale] = en | ja
- 에이전트: medicare-agents/app/agents/base_agent.py 상속
