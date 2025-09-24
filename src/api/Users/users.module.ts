import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/db/database.module';
import { Repositories } from 'src/db/entity.repositories';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/auth';

@Module({
  imports: [DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '24h'}
    })
  ],
  controllers: [UsersController],
  providers: [...Repositories, UsersService]
})
export class UsersModule {}
