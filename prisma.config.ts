import { configDotenv } from "dotenv";
import path from "node:path";
import { env, PrismaConfig } from "prisma/config";
configDotenv();
export default {
    schema: path.join("src", "schema", "schema.prisma"),
    migrations: {
        path: path.join("db", "migrations"),
    },
    views: {
        path: path.join("db", "views"),
    },
    typedSql: {
        path: path.join("db", "queries"),
    },
    engine: "classic",
    datasource: {
        url: env("DATABASE_URL")
    }
} satisfies PrismaConfig;