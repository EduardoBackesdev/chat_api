import { DataSource } from 'typeorm';
import { Accounts } from './Entitys/user.entity';
import { MailToken } from './Entitys/mail.entity';

export const Repositories = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(Accounts),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MAIL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(MailToken),
    inject: ['DATA_SOURCE'],
  },
];