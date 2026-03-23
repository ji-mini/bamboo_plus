#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

if [ "${RUN_MIGRATIONS}" = "true" ]; then
  echo "Applying Prisma migrations..."
  npx prisma migrate deploy
fi

if [ "${RUN_SEED}" = "true" ]; then
  echo "Running seed..."
  npm run prisma:seed
fi

echo "Starting server..."
exec "$@"
