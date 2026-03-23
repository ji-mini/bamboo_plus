#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Applying Prisma migrations..."
  until npx prisma migrate deploy; do
    echo "Database is not ready yet. Retrying in 3 seconds..."
    sleep 3
  done
fi

if [ "${RUN_SEED:-true}" = "true" ]; then
  echo "Running Prisma seed..."
  npm run prisma:seed
fi

exec "$@"
