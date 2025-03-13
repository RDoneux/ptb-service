import { MigrationInterface, QueryRunner } from 'typeorm';

export class V01_POPULATEEXAMPLESCHEMA1729664009106 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO example (id, first_name, last_name) VALUES ("624f138e-77e2-4817-9835-d271a4198c68", "John", "Doe")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM example
        `);
  }
}
