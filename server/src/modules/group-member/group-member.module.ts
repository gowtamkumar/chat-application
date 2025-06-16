import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMemberEntity } from './entities/group-member.entity';
import { GroupMemberController } from './controllers/group-member.controller';
import { GroupMemberService } from './services/group-member.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMemberEntity])],
  controllers: [GroupMemberController],
  providers: [GroupMemberService],
  exports: [GroupMemberService],
})
export class GroupMemberModule {}
