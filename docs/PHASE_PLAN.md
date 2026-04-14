# Phase Plan — Project Medicare
> 마지막 업데이트: 2026-04-14

---

## 완료된 Phase

| Phase | 이름 | 완료일 | 상태 |
|-------|------|--------|------|
| 0 | 기반 구축 | 2026-03 | ✅ 완료 |
| 1 | 고객 MVP | 2026-03 | ✅ 완료 |
| 2 | 어드민 OS | 2026-03 | ✅ 완료 |
| 3 | AI 에이전트 레이어 | 2026-04 | ✅ 완료 |
| 4 | 고도화 | 2026-04-14 | ✅ 완료 |

---

## Phase 4 — 고도화 상세 (2026-04-14 완료)

### 인증/보안
- **Supabase Auth 연동**: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`
- **dev fallback**: `SUPABASE_URL` 없으면 HS256 JWT 자동 발급 (`DEBUG=true` 시만 활성화)
- **Admin JWT RBAC**: static bearer token → HS256 JWT + `role == "admin"` 검증으로 교체
- **프로덕션 시크릿 검증**: `DEBUG=false`에서 `JWT_SECRET` / `ADMIN_API_TOKEN` 32자 미만 시 앱 기동 차단
- **JWT 쿠키**: `HttpOnly; Secure; SameSite=Strict` 설정 (XSS 방어)
- **Next.js API Route 프록시**: `/api/auth/*`, `/api/proxy/*`, `/api/admin/auth/login`

### AI 에이전트 5개 추가 (총 7개)
| 에이전트 | 모델 | 역할 |
|----------|------|------|
| OfferAgent | haiku-4-5 | 사용자 프로필 기반 맞춤 오퍼 생성 |
| RetentionAgent | haiku-4-5 | 이탈 위험 사용자 감지 + 재유입 트리거 |
| CrossSellAgent | haiku-4-5 | 교차 판매 상품 추천 |
| ReviewAgent | haiku-4-5 | 리뷰 텍스트 분석 + 감성 분류 (positive/negative/neutral) |
| CSAgent | sonnet-4-6 | 고객 문의 자동 응답 초안 생성 |
| IntakeAgent | sonnet-4-6 | 신규 상담 접수 분류 (Phase 3 기존) |
| ComplianceGateAgent | haiku→sonnet | 의료 문구 위반 감지 (Phase 3 기존) |

### 프론트엔드 신규 페이지
- `/[locale]/auth/login` — 고객 로그인 (Supabase Auth)
- `/[locale]/auth/register` — 고객 회원가입 (Supabase Auth)
- `/[locale]/dashboard` — 고객 마이페이지 (상담 이력, 구독 현황)
- i18n: en/ja 번역 auth + dashboard 완성

### 인프라
- **Alembic**: `alembic.ini`, `migrations/env.py`, `migrations/versions/001_initial_schema.py` (11개 테이블)
- **배포 설정**: `vercel.json` (Next.js + 보안 헤더 + API rewrite), `railway.toml` (Dockerfile 빌드), `docker-compose.yml` (로컬 전체 스택)
- **E2E**: Playwright 설정 (`playwright.config.ts`) + 5개 스펙 파일

---

## Phase 5 — 실 배포 및 안정화 (예정)

| 우선순위 | 작업 | 담당 |
|---------|------|------|
| HIGH | Vercel 프론트엔드 실 배포 | 배포팀 |
| HIGH | Railway 백엔드 실 배포 | 배포팀 |
| HIGH | Supabase 프로젝트 생성 + Alembic 마이그레이션 | 백엔드 |
| MED | Admin subscriptions router DB 연결 (현재 mock 응답) | 백엔드 |
| MED | Playwright CI (GitHub Actions workflow 추가) | 인프라 |
| MED | 에러 모니터링 (Sentry 연동) | 인프라 |
| LOW | Review & CS Agent 실 사용 연동 (어드민 UI에서 트리거) | 백엔드+프론트 |
| LOW | 이메일 알림 (Resend) — 상담 접수 확인 메일 | 백엔드 |

---

## Phase 6 — 성장 (중기 계획)

| 항목 | 설명 |
|------|------|
| 결제 연동 | Stripe 또는 국내 PG (구독 결제) |
| 다국어 확장 | ko (한국어) 추가 |
| 모바일 최적화 | PWA 또는 React Native |
| A/B 테스트 | Offer Agent 오퍼 variant 실험 |
| 어드민 분석 고도화 | 코호트 분석, LTV 예측 |

---

## 참고 문서

- 실 배포 절차: `docs/DEPLOY_CHECKLIST.md`
- 전체 인수인계: `HANDOFF.md`
- 에이전트 스펙: `docs/AGENTS.md`
- API 전체 목록: `docs/API_MAP.md`
- 컴플라이언스 규칙: `docs/COMPLIANCE.md`
