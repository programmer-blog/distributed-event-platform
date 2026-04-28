import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MessagingModule } from '../../messaging/messaging.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MessagingModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
