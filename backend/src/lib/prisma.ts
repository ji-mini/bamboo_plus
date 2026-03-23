import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const databaseUrl = new URL(connectionString);
const hostname = databaseUrl.hostname;
const sslMode = databaseUrl.searchParams.get("sslmode");
const isLocalDatabaseHost = ["localhost", "127.0.0.1", "db", "postgres"].includes(hostname);
const useSsl = sslMode === "require" || !isLocalDatabaseHost;

// PrismaPg adapter에 SSL을 명시적으로 넘겨야 할 때만 활성화한다.
databaseUrl.searchParams.delete("sslmode");
databaseUrl.searchParams.delete("uselibpqcompat");

const adapter = new PrismaPg({
  connectionString: databaseUrl.toString(),
  ...(useSsl
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});

export const prisma = new PrismaClient({ adapter });
