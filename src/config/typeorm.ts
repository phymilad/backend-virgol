import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

config({path: join(process.cwd(), ".env")})
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env 

let dataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    password: DB_PASSWORD,
    username: DB_USERNAME,
    database: DB_NAME,
    port: DB_PORT ? +DB_PORT : 5432,
    synchronize: false,
    entities: [
        "dist/**/**/**/*.entity{.ts,.js}",
        "dist/**/**/*.entity{.ts,.js}",
    ],
    migrations: [
        "dist/migrations/*{.ts,.js}"
    ],
    migrationsTableName: "virgoul_migration_db"
})

export default dataSource