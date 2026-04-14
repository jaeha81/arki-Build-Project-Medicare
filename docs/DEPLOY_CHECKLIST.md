# 배포 체크리스트
> 마지막 업데이트: 2026-04-14
> 대상 스택: Supabase (DB/Auth) + Railway (백엔드) + Vercel (프론트엔드)

---

## 1. Supabase 설정

- [ ] Supabase 프로젝트 생성 (supabase.com)
- [ ] Project URL, anon key, service_role_key 복사
- [ ] Authentication > Email 활성화
- [ ] (선택) Authentication > Email Templates 커스터마이징
- [ ] Database > Connection String (Pooler) 복사 → `DATABASE_URL`로 사용

---

## 2. Railway 백엔드 배포

- [ ] Railway 계정 + 프로젝트 생성 (railway.app)
- [ ] GitHub repo 연결 (Root Directory: `medicare-backend`)
- [ ] Railway PostgreSQL 또는 Supabase DB 선택 후 `DATABASE_URL` 확정
- [ ] Railway Redis 서비스 추가 → `REDIS_URL` 확인
- [ ] 환경변수 설정 (Railway Dashboard > Variables):

  | 변수 | 값 | 비고 |
  |------|-----|------|
  | `DATABASE_URL` | `postgresql+asyncpg://...` | Supabase Pooler 또는 Railway PG |
  | `REDIS_URL` | `redis://...` | Railway Redis |
  | `ANTHROPIC_API_KEY` | `sk-ant-...` | Anthropic Console |
  | `JWT_SECRET` | 64자 hex | `python -c "import secrets; print(secrets.token_hex(32))"` |
  | `ADMIN_API_TOKEN` | 64자 hex | 동일 방법 |
  | `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 프로젝트 설정 |
  | `SUPABASE_ANON_KEY` | `eyJ...` | Supabase API Keys |
  | `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase API Keys (비공개) |
  | `DEBUG` | `false` | 프로덕션 필수 |
  | `ALLOWED_ORIGINS` | `https://your-vercel-domain.vercel.app` | CORS |
  | `PORT` | `8000` | railway.toml에 기본 설정됨 |

- [ ] 배포 확인: `https://your-railway-domain/health` → `{"status":"ok"}` 응답
- [ ] Alembic 마이그레이션 실행:
  ```bash
  railway run alembic upgrade head
  ```
- [ ] DB 시드 실행:
  ```bash
  railway run python scripts/seed.py
  railway run python scripts/seed_compliance.py
  ```

---

## 3. Vercel 프론트엔드 배포

- [ ] Vercel 계정 + 프로젝트 생성 (vercel.com)
- [ ] GitHub repo 연결
- [ ] Root Directory: `medicare-frontend`
- [ ] Framework Preset: **Next.js** (자동 감지)
- [ ] Build Command: `npm install --legacy-peer-deps && npm run build` (vercel.json에 기본 설정됨)
- [ ] 환경변수 설정 (Vercel Dashboard > Settings > Environment Variables):

  | 변수 | 값 | 비고 |
  |------|-----|------|
  | `NEXT_PUBLIC_API_URL` | `https://your-railway-domain.up.railway.app` | Railway 백엔드 URL |
  | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 프로젝트 URL |
  | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon key (공개 가능) |

- [ ] Vercel Secret 이름 확인 (`vercel.json` `env` 블록의 `@` 참조명과 일치 여부):
  - `@medicare_api_url`
  - `@medicare_supabase_url`
  - `@medicare_supabase_anon_key`
- [ ] 배포 확인: Vercel 도메인 접속 → 홈페이지 정상 렌더링

---

## 4. 배포 후 검증

- [ ] `/health` 엔드포인트 응답 확인 (Railway)
- [ ] 회원가입 플로우 동작: `/[locale]/auth/register`
- [ ] 로그인 플로우 동작: `/[locale]/auth/login`
- [ ] 고객 대시보드 접근: `/[locale]/dashboard` (인증 후)
- [ ] 어드민 로그인 동작: `/admin/login` (JWT RBAC)
- [ ] 상담 신청 동작: `/[locale]/consultation` → POST `/api/v1/consultations`
- [ ] 에이전트 실행 확인: 어드민 > 에이전트 패널에서 ON/OFF 토글
- [ ] CORS 확인: 프론트엔드 → 백엔드 API 호출 시 오류 없음

---

## 5. 보안 최종 점검

- [ ] `DEBUG=false` 확인 (Railway Variables)
- [ ] `JWT_SECRET` 32자 이상 확인 (미만 시 앱 기동 차단됨)
- [ ] `ADMIN_API_TOKEN` 32자 이상 확인
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `SUPABASE_SERVICE_ROLE_KEY`가 프론트엔드 환경변수에 노출되지 않는지 확인
- [ ] Vercel rewrites 확인: `/api/*` → Railway 백엔드 프록시 정상 동작

---

## 6. 로컬 Docker Compose (개발/스테이징)

전체 스택 로컬 실행:
```bash
# 프로젝트 루트에서
docker compose up --build

# 서비스 접근
# 프론트엔드: http://localhost:3000
# 백엔드:     http://localhost:8000
# 에이전트:   http://localhost:8001
# PostgreSQL: localhost:5432
# Redis:      localhost:6379
```

주의: `docker-compose.yml`의 환경변수는 개발용 더미값입니다. 프로덕션 배포 전 반드시 Railway/Vercel 대시보드에서 실제 값으로 설정하세요.
