import { DataSource } from 'typeorm';
import { Accounts } from './Entitys/user.entity';

export const Repositories = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Accounts),
    inject: ['DATA_SOURCE'],
  },
];