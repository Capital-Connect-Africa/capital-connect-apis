import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { EligibilityRule } from './entities/eligibility-rule.entity';
import { User } from 'src/users/entities/user.entity';
import { UserVoucher } from './entities/user-voucher.entity';

@Module({
  controllers: [VoucherController],
  providers: [VoucherService, ],
  imports: [TypeOrmModule.forFeature([Voucher, EligibilityRule, User, UserVoucher])],
  exports: [VoucherService]
})
export class VoucherModule {}
