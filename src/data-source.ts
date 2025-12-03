// data-source.ts
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv-flow';

loadEnv(); // baca .env, .env.development, dll sesuai NODE_ENV

export default new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT!),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    migrations: ['src/migrations/*{.ts,.js}', 'src/first_data/*{.ts,.js}'],
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: false,
    logger: 'file'
});