import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const databaseUrl = new URL(connectionString);

// RDS 접속은 코드에서 SSL 옵션을 제어하므로 URL의 sslmode는 제거한다.
databaseUrl.searchParams.delete("sslmode");
databaseUrl.searchParams.delete("uselibpqcompat");

const adapter = new PrismaPg({
  connectionString: databaseUrl.toString(),
  ssl: {
    rejectUnauthorized: false,
  },
});

export const prisma = new PrismaClient({ adapter });
