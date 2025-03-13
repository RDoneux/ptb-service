import { DataSource } from 'typeorm';

export const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:', // Use in-memory database for faster tests
  synchronize: true, // Automatically synchronize the database with your entities
  entities: ['src/entities/*.ts'],
});

export async function prepareDataSource(dataSource: DataSource) {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  await dataSource.synchronize(true);
}

export async function teardownDataSource(dataSource: DataSource) {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
}
