import request, { Response } from 'supertest';
import { application, server } from '..';
import { prepareDataSource, teardownDataSource } from './test-utils';
import { Example } from '../entities/example.entity';
import { dataSource } from '../globals/data-source';

describe('example', () => {
  beforeEach(async () => {
    await prepareDataSource(dataSource);
  });

  afterAll(async () => {
    server.close();
    await teardownDataSource(dataSource);
  });

  it('should return 400 BAD_REQUEST if firstName and lastName are undefined', async () => {
    const response: Response = await request(application).get('/example');
    expect(response.status).toEqual(400);
    expect(response.body).toEqual('firstName & lastName are required');
  });

  it('should return 200 OK with empty array if no matching data', async () => {
    const response: Response = await request(application)
      .get('/example')
      .query({ firstName: 'john', lastName: 'doe' });
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });

  it('should return 200 OK with matching data array', async () => {
    const testExampleData = {
      id: '2e3190c7-8e78-4833-a6d1-50eb8cff1879',
      firstName: 'john',
      lastName: 'doe',
    };

    await dataSource.getRepository(Example).save(testExampleData);

    const response: Response = await request(application)
      .get('/example')
      .query({ firstName: 'john', lastName: 'doe' });
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([{ ...testExampleData }]);
  });
});
