import dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { testDataSource } from '../__e2e_tests__/test-utils';
import { Example } from '../entities/example.entity';

const _dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DS_HOST,
  port: Number.parseInt(process.env.DS_PORT || '3306'),
  username: process.env.DS_USERNAME,
  password: process.env.DS_PASSWORD,
  database: process.env.DS_DATABASE,
  // entities: ['*.entity.{js,ts}'],
  // entities: ["src/entities/*{.js,.ts}"],
  entities: [Example],
  migrations: ['src/resources/migrations/*.ts'],
  logging: true,
  synchronize: false,
});

export const dataSource = process.env.NODE_ENV === 'test' ? testDataSource : _dataSource;
