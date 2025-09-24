import { Module } from '@nestjs/common';
import { AppGateway } from './api/ws/wsGateway';
import { UsersModule } from './api/Users/users.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [AppGateway, UsersModule],
  providers: [DatabaseModule],
})
export class AppModule {}
