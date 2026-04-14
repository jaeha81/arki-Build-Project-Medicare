# Project Medicare — 작업 인수인계 메모
> 마지막 업데이트: 2026-04-14
> GitHub: https://github.com/jaeha81/arki-Build-Project-Medicare.git

---

## 다른 PC에서 바로 시작하는 방법

```bash
# 1. 클론
git clone https://github.com/jaeha81/arki-Build-Project-Medicare.git
cd arki-Build-Project-Medicare

# 2. 환경변수 설정
cp .env.example .env
# .env 파일을 열고 실제 값 입력:
#   DATABASE_URL, ANTHROPIC_API_KEY, REDIS_URL, SUPABASE_URL 등

# 3. 프론트엔드 의존성 설치 + dev 서버 시작
cd medicare-frontend
npm install --legacy-peer-deps
npm run dev          # → http://localhost:3000

# 4. 백엔드 의존성 설치 + 서버 시작 (별도 터미널)
cd ../medicare-backend
pip install -r requirements.txt
python scripts/seed.py          # DB 시드 (최초 1회)
python scripts/seed_compliance.py   # 컴플라이언스 시드 (최초 1회)
uvicorn app.main:app --reload --port 8000

# 5. AI 에이전트 서비스 시작 (별도 터미널, 선택)
cd ../medicare-agents
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

---

## 현재 완료된 Phase 요약

### ✅ Phase 0 — 기반 구축
- 모노레포 구조: `medicare-frontend/` + `medicare-backend/` + `medicare-agents/`
- `.env.example`, `.gitignore` 완성
- Next.js 14 (App Router) + TypeScript strict + Tailwind + shadcn/ui Base Nova
- FastAPI 0.110 + SQLAlchemy 2.0 async + Pydantic v2
- next-intl i18n (en/ja), Zustand, React Query v5

### ✅ Phase 1 — 고객 MVP
**프론트엔드 페이지 (21개 라우트)**
- `/[locale]/` — 홈 (Hero, TrustBar, CategoryCards, FAQ 미리보기, CTA)
- `/[locale]/category` — 4개 버티컬 목록
- `/[locale]/category/[slug]` — 버티컬 상세
- `/[locale]/consultation` — 5-step 상담 접수 (zod 검증, Zustand 상태)
- `/[locale]/faq` — FAQ (탭 필터 + Accordion)
- `/[locale]/how-it-works` — 6단계 플로우
- `/[locale]/legal/[pageType]` — 법적 페이지 5종 (DRAFT 배너)

**백엔드 API (9개 엔드포인트)**
```
GET  /api/v1/verticals
GET  /api/v1/verticals/{slug}
GET  /api/v1/verticals/{slug}/products
GET  /api/v1/faq
POST /api/v1/consultations
GET  /api/v1/consultations/{id}/status
GET  /api/v1/legal/{page_type}
```

### ✅ Phase 2 — 어드민 OS
**어드민 페이지 (8개)**
- `/admin` — Medicare OS 메인 대시보드 (KPI 4개)
- `/admin/agents` — 에이전트 컨트롤 센터
- `/admin/consultations` — 상담 CRUD
- `/admin/products` — 상품 관리
- `/admin/reviews` — 리뷰 관리
- `/admin/subscriptions` — 구독 관리
- `/admin/approvals` — AI 에이전트 승인 큐
- `/admin/login` — 어드민 로그인

**보안**: admin 라우터 전체 `HTTPBearer` 토큰 보호 (P1 Codex 수정)
**어드민 로그인**: `http://localhost:3000/admin/login`
- 개발용 임시 계정: `ADMIN_DEV_EMAIL` / `ADMIN_DEV_PASSWORD` (`.env` 참조)

### ✅ Phase 3 — AI 에이전트 레이어

**medicare-agents 서비스 (port 8001)**
- `BaseAgent` 추상 클래스 (Claude API 래퍼, 로깅, 승인 요청)
- `IntakeAgent` — Sonnet, 신규 상담 접수 분류
- `ComplianceGateAgent` — Haiku(1차) → Sonnet(재검사), 의료 문구 위반 감지
- Redis 큐 헬퍼 (`enqueue_task`, `dequeue_task`, `get_task_status`)

**컴플라이언스 엔진**
- `ProhibitedPhrase` 모델 (정규식 패턴 포함)
- 20개 시드 데이터 (`scripts/seed_compliance.py`)
- 3단계 점수 계산: critical -0.3, warning -0.1 (임계 0.7)

**KPI 대시보드**
- `/api/v1/admin/kpi/snapshot` — 실시간 KPI 집계
- `/api/v1/admin/kpi/trend` — 일별 상담 트렌드
- `/api/v1/admin/kpi/verticals` — 버티컬별 분포
- 프론트엔드: SVG 라인 차트 + Tailwind 바 차트 (30초 자동갱신)

**새 어드민 페이지**
- `/admin/agents` — 에이전트 ON/OFF 토글, 모델 배지
- `/admin/agents/logs` — 에이전트 액션 로그
- `/admin/compliance` — 컴플라이언스 검사 큐

### ✅ Phase 4 — 고도화 (2026-04-14 완료)

**인증/보안:**
- Supabase Auth 연동: `POST/GET /api/v1/auth/{register,login,logout,me}`
- dev fallback: `SUPABASE_URL` 없으면 HS256 JWT 자동 발급 (`DEBUG=true` 시만)
- Admin JWT RBAC: static bearer token → HS256 JWT + `role=="admin"` 검증
- 프로덕션 시크릿 검증: `DEBUG=false`에서 32자 미만 시크릿 시 앱 기동 차단
- JWT 쿠키: `HttpOnly; Secure; SameSite=Strict` (XSS 보호)
- Next.js API Route 프록시: `/api/auth/*`, `/api/proxy/*`, `/api/admin/auth/login`

**에이전트 5개 추가 (총 7개):**
- `OfferAgent` (haiku-4-5): 맞춤 오퍼 생성
- `RetentionAgent` (haiku-4-5): 이탈 위험 감지
- `CrossSellAgent` (haiku-4-5): 교차 판매 추천
- `ReviewAgent` (haiku-4-5): 리뷰 분석 + 감성 분류
- `CSAgent` (sonnet-4-6): 고객 문의 자동 응답

**프론트엔드:**
- `/[locale]/auth/login`, `/[locale]/auth/register`
- `/[locale]/dashboard` (고객 마이페이지)
- i18n: en/ja auth+dashboard 완성

**인프라:**
- Alembic: `alembic.ini`, `migrations/env.py`, `001_initial_schema` (11 테이블)
- 배포: `vercel.json`, `railway.toml`, `docker-compose.yml`
- E2E: Playwright 설정 + 5개 스펙 파일

---

## 다음 단계 — Phase 5

| 우선순위 | 작업 |
|---------|------|
| HIGH | Vercel/Railway 실 배포 (환경변수 설정 후 push) |
| HIGH | Supabase 프로젝트 생성 + DB 마이그레이션 실행 |
| MED | Admin subscriptions router DB 연결 (현재 mock) |
| MED | Playwright CI (GitHub Actions) |
| LOW | Review & CS Agent 실 사용 연동 |

자세한 배포 절차는 `docs/DEPLOY_CHECKLIST.md` 참조.

---

## 주요 파일 위치

```
arki-Build-Project-Medicare/
├── .env.example                    ← 환경변수 템플릿
├── HANDOFF.md                      ← 이 파일
├── vercel.json                     ← Vercel 배포 설정
├── railway.toml                    ← Railway 배포 설정
├── docker-compose.yml              ← 로컬 전체 스택 실행
├── docs/                           ← 설계 문서 전체
│   ├── DEPLOY_CHECKLIST.md         ← 실 배포 단계별 체크리스트
│   ├── PHASE_PLAN.md               ← Phase 4+ 계획 및 완료 현황
│   ├── ARCHITECTURE.md
│   ├── AGENTS.md                   ← 7개 에이전트 스펙
│   ├── API_MAP.md                  ← 전체 API 엔드포인트
│   └── COMPLIANCE.md
├── medicare-frontend/
│   ├── src/app/                    ← Next.js 페이지
│   ├── src/app/api/proxy/          ← Next.js API Route 프록시
│   ├── src/components/admin/       ← 어드민 컴포넌트
│   ├── src/hooks/                  ← React Query 훅
│   ├── src/types/                  ← TypeScript 타입
│   └── src/stores/                 ← Zustand 스토어
├── medicare-backend/
│   ├── app/models/                 ← SQLAlchemy ORM 모델
│   ├── app/routers/v1/auth/        ← Supabase Auth 연동 라우터
│   ├── app/routers/v1/admin/       ← 어드민 API (JWT RBAC 보호)
│   ├── app/services/               ← 비즈니스 로직
│   ├── migrations/                 ← Alembic 마이그레이션
│   └── scripts/seed*.py            ← DB 시드 스크립트
└── medicare-agents/
    ├── app/agents/                 ← 7개 에이전트 (Base + 6 구현체)
    ├── app/queue/redis_client.py   ← Redis 큐 헬퍼
    └── requirements.txt
```

---

## 기술 스택 요약

| 레이어 | 기술 |
|--------|------|
| 프론트엔드 | Next.js 14, TypeScript, Tailwind, shadcn/ui Base Nova |
| i18n | next-intl (en/ja) |
| 상태관리 | Zustand + React Query v5 |
| 백엔드 | FastAPI 0.110, Python 3.11 |
| ORM | SQLAlchemy 2.0 async + asyncpg |
| DB 마이그레이션 | Alembic |
| DB | PostgreSQL (Supabase) |
| 인증 | Supabase Auth + HS256 JWT (dev fallback) |
| AI | Anthropic Claude API (haiku-4-5 / sonnet-4-6) |
| 에이전트 큐 | Redis |
| 이메일 | Resend |
| E2E 테스트 | Playwright |

---

## 절대 규칙 (Claude Code에게)

1. **default export 금지** — components는 `export function`, pages는 `export default function`
2. **`any` 타입 금지** — 모든 타입 명시
3. **의료 주장 금지** — `{/* COMPLIANCE PLACEHOLDER */}` 사용
4. **시크릿 하드코딩 금지** — `.env` 참조
5. **shadcn/ui Base Nova**: Button은 `asChild` 대신 `render={<Link />}` 패턴
6. **admin API 보호**: 모든 `/api/v1/admin/*` 엔드포인트는 `require_admin_jwt` 의존성 필요 (Phase 4 이후 JWT RBAC)
7. **프로덕션 보안**: `DEBUG=false` 환경에서 JWT_SECRET / ADMIN_API_TOKEN 32자 미만 시 기동 차단됨
