import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UserModule, WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
