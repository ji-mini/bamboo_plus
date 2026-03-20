# Bamboo+

사내 익명 대나무숲 MVP입니다.

## 구성

- `backend`: Express + TypeScript + Prisma + PostgreSQL + JWT
- `frontend`: React 18 + Vite + Tailwind CSS + TanStack Query

## 실행

1. `backend/.env.example`를 참고해 `backend/.env`를 설정합니다.
2. PostgreSQL 데이터베이스를 준비합니다.
3. 아래 명령을 순서대로 실행합니다.

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

## 기본 관리자 계정

- 이메일: `admin@bamboo.local`
- 비밀번호: `admin1234`

시드 실행 시 생성되며, 운영 환경에서는 반드시 변경해야 합니다.
