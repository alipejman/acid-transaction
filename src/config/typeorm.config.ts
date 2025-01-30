import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "aliapi",
    database: "ACID",
    autoLoadEntities: false,
    synchronize: true,
    entities: [
        "dist/**/**/**/*.entity{.ts,.js},",
        "dist/**/**/*.enity{.ts, .js}"
    ],
}