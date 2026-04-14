# GitHub Actions — Secrets 설정 가이드

Repository → Settings → Secrets and variables → Actions → New repository secret

## 필수 Secrets

| Secret | 설명 | 획득 방법 |
|--------|------|----------|
| `VERCEL_TOKEN` | Vercel API 토큰 | vercel.com → Account Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Vercel 조직/팀 ID | vercel.com → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID | 프로젝트 → Settings → General → Project ID |
| `RAILWAY_TOKEN` | Railway API 토큰 | railway.app → Account → Tokens → Create Token |

## Environment 설정

Settings → Environments → New environment → `production`

위 4개 Secrets를 `production` 환경에 등록.
배포 워크플로우는 `environment: production` 조건 사용.

## 워크플로우 파일별 트리거 조건

| 파일 | 트리거 | 조건 |
|------|--------|------|
| `ci.yml` | push/PR to master | 항상 실행 |
| `deploy-vercel.yml` | push to master | `medicare-frontend/**` 변경 시 |
| `deploy-railway.yml` | push to master | `medicare-backend/**` 또는 `medicare-agents/**` 변경 시 |
