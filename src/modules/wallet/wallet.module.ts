import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './entity/wallet.entity';
import { UserEntity } from '../user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, UserEntity])],
  controllers: [WalletController],
  providers: [WalletService, UserService],
})
export class WalletModule {}
