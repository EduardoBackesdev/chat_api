import { Module } from '@nestjs/common';
import { AppGateway } from './api/ws/wsGateway';
import { UsersModule } from './api/Users/users.module';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AppGateway, UsersModule, AuthModule],
  providers: [DatabaseModule],
})
export class AppModule {}
