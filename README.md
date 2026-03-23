# Bamboo+

사내 익명 대나무숲 MVP입니다.

## 프로젝트 구조

```text
bamboo_plus/
├─ backend
├─ frontend
├─ docker
│  ├─ backend
│  └─ frontend
├─ nginx
├─ docker-compose.yml
└─ docker-compose.dev.yml
```

## 기술 구성

- `backend`: Node.js + Express + TypeScript + Prisma + PostgreSQL + JWT
- `frontend`: React 18 + Vite + Tailwind CSS + TanStack Query
- `nginx`: 프론트 reverse proxy 및 `/api` → 백엔드 proxy
- `docker compose`: 개발/운영 공통 오케스트레이션

## 환경 변수

루트 `.env.example`를 복사해서 루트 `.env`를 만든 뒤 값을 설정합니다.

```bash
cp .env.example .env
```

주요 변수:

- `DATABASE_URL`: 기본은 compose 내부 `db` 컨테이너 기준
- `CLIENT_ORIGIN`: 브라우저 접근 주소
- `NGINX_PORT`: 외부 노출 포트
- `RUN_MIGRATIONS`: 컨테이너 시작 시 Prisma migrate 실행 여부
- `RUN_SEED`: 컨테이너 시작 시 Prisma seed 실행 여부

## 로컬 실행

### Node 기반 실행

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

```bash
cd frontend
npm run dev
```

기본 개발 포트는 `frontend: 4000`, `backend: 4001`입니다.

### Docker 개발 모드

개발 모드는 소스 마운트 + Vite dev server + Express watch 모드로 실행됩니다.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

접속 주소:

- 앱: `http://localhost:4000`
- DB: `localhost:5432`

종료:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

### Docker 운영 모드

운영 모드는 프론트 정적 빌드 후 nginx 서빙, 백엔드는 빌드된 `dist` 기준으로 동작합니다.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

종료:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## Docker 파일 경로

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker/backend/entrypoint.sh`
- `docker/backend/dev-entrypoint.sh`
- `docker/frontend/nginx.conf`
- `nginx/nginx.prod.conf`
- `nginx/nginx.dev.conf`
- `docker-compose.yml`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`

## Prisma migrate / seed

백엔드 컨테이너 시작 시 아래 순서가 자동 실행됩니다.

1. `prisma generate`
2. `prisma migrate deploy`
3. `prisma:seed`
4. 서버 시작

`RUN_MIGRATIONS=false`, `RUN_SEED=false`로 비활성화할 수 있습니다.

## 기본 관리자 계정

- 이메일: `admin@bamboo.local`
- 비밀번호: `admin1234`

시드 실행 시 생성되며, 운영 환경에서는 반드시 변경해야 합니다.
