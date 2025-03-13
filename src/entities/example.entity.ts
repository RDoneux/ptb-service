import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'example' })
export class Example {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName!: string;
}
