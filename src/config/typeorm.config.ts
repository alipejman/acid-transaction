import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "aliapi",
    database: "ACID",
    autoLoadEntities: true,
    synchronize: true,
    entities: [
        "dist/**/**/**/*.entity{.ts,.js},",
        "dist/**/**/*.entity{.ts, .js}"
    ],
}