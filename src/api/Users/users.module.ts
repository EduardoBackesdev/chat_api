import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/db/database.module';
import { Repositories } from 'src/db/user.repositories';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/lib/mail.module';

@Module({
  imports: [DatabaseModule,
    AuthModule,
    MailModule,
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
