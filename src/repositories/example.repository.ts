import { Example } from '../entities/example.entity';
import { dataSource } from '../globals/data-source';

export const ExampleRepository = dataSource.getRepository(Example).extend({
  findByName(firstName: string, lastName: string) {
    return this.createQueryBuilder('example')
      .where('example.firstName = :firstName', { firstName })
      .andWhere('example.lastName = :lastName', { lastName })
      .getMany();
  },
});
