# Project Medicare — 작업 인수인계 메모
> 마지막 업데이트: 2026-04-18 (Vercel 배포 완료)
> GitHub: https://github.com/jaeha81/arki-Build-Project-Medicare.git

---

## 현재 진행 상태

### ✅ 완료된 작업
| 항목 | 설명 |
|------|------|
| Phase 1~5 전체 개발 | 백엔드 API + 프론트엔드 관리자 대시보드 전부 실제 API 연동 완료 |
| 코드 품질 | silent except → logger.warning 수정 (compliance_agent, intake_agent, compliance_service) |
| Legal 페이지 | 하드코딩 placeholder → `/api/v1/legal/{page_type}` 실제 API 연동 |
| Supabase 프로젝트 | 생성 완료 (`juvjtorttxnlagzbnwiz`) |
| Supabase DB 마이그레이션 | SQL Editor에서 수동 실행 완료 (전체 테이블 생성됨) |
| Vercel 프로젝트 연결 | `medicare-frontend` 연결, 환경변수 3개 등록 |
| GitHub Secrets 등록 | 7개 시크릿 등록 완료 |
| TypeScript 타입 수정 | `FAQ.is_active`, `Product.is_active` 추가, e2e/playwright tsconfig 제외 |
| **Vercel 프론트엔드 배포** | ✅ **배포 완료** → https://medicare-frontend-rho.vercel.app |

---

### ❌ 미완료 — 다음 PC에서 계속할 작업

#### 🟡 1순위: Railway 배포 (백엔드)

**문제:** Railway 무료 체험 만료 → Hobby Plan ($5/월) 결제 필요  
**링크:** https://railway.app/account/billing

결제 후 Railway 대시보드에서 새 프로젝트 생성 + 아래 환경변수 등록:
```
DATABASE_URL=postgresql+asyncpg://postgres:ljh911314%40%40@db.juvjtorttxnlagzbnwiz.supabase.co:5432/postgres?ssl=require
SUPABASE_URL=https://juvjtorttxnlagzbnwiz.supabase.co
SUPABASE_ANON_KEY=(GitHub Secrets에 등록된 값)
SUPABASE_SERVICE_ROLE_KEY=(GitHub Secrets에 등록된 값)
JWT_SECRET=1de65eda2f5e988669a775b7a8eb462aae3a2e1f9c8260d4fb6d5d8f60dc9bb0
ADMIN_API_TOKEN=068c150acf303ed4981f07ef92e582bb14881cc2591aefd996d2c46aafdf4ef8
ALLOWED_ORIGINS=["https://medicare-frontend.vercel.app"]
DEBUG=false
```

Railway 배포 완료 후 → Vercel의 `NEXT_PUBLIC_API_URL`을 실제 Railway URL로 업데이트:
```bash
cd medicare-frontend
echo "https://실제-railway-url.up.railway.app" | vercel env add NEXT_PUBLIC_API_URL production --token $VERCEL_TOKEN --scope dltkddlf231-8261s-projects --yes
```

---

## 환경 정보 (공개 가능한 것만)

| 항목 | 값 |
|------|-----|
| Supabase Project ID | `juvjtorttxnlagzbnwiz` |
| Supabase URL | `https://juvjtorttxnlagzbnwiz.supabase.co` |
| Vercel Project ID | `prj_ejP3ZznHQdm39rzdBbNpW1nUQTmc` |
| Vercel Org ID | `team_xnxqY7TcLGhBBjfBy9xLSFLd` |
| GitHub Repo | `https://github.com/jaeha81/arki-Build-Project-Medicare` |

---

## 다른 PC에서 시작하는 방법

```bash
# 1. 최신 코드 가져오기
git clone https://github.com/jaeha81/arki-Build-Project-Medicare.git
# 또는 이미 있으면:
git pull origin master

# 2. 프론트엔드 의존성
cd medicare-frontend && npm install

# 3. 백엔드 의존성
cd ../medicare-backend && pip install -r requirements.txt

# 4. 백엔드 .env 생성 (gitignore됨 — 직접 만들어야 함)
# .env 내용은 이 파일의 2순위 Railway 섹션 참고

# 5. Vercel 빌드 오류 먼저 수정 → 배포
```

---

## 주요 파일 위치

| 파일 | 역할 |
|------|------|
| `medicare-frontend/src/types/catalog.ts` | FAQ, Product 타입 (is_active 추가됨) |
| `medicare-frontend/src/app/[locale]/faq/page.tsx` | ⚠️ Accordion props 수정 필요 |
| `medicare-frontend/tsconfig.json` | e2e, playwright.config.ts 빌드에서 제외됨 |
| `medicare-backend/migrations/env.py` | Alembic 마이그레이션 (sync psycopg2 방식) |
| `medicare-backend/.env` | ⚠️ gitignore됨 — 직접 생성 필요 |
| `.github/workflows/deploy-vercel.yml` | Vercel CI/CD (master push 시 자동 배포) |
| `.github/workflows/deploy-railway.yml` | Railway CI/CD (master push 시 자동 배포) |
