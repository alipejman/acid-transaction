import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WalletEntity } from "./entity/wallet.entity";
import { DataSource, Repository } from "typeorm";
import { DepositDto } from "./dto/wallet.dto";
import { UserEntity } from "../user/entity/user.entity";
import { UserService } from "../user/user.service";
import { walletType } from "./wallet.enum";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    private userService: UserService,
    private dataSource: DataSource
  ) {}

  async deposit(depositDto: DepositDto) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const { amount, fullname, mobile } = depositDto;
        const user = await this.userService.create({ mobile, fullname });
        const userData = await queryRunner.manager.findOneBy(UserEntity, {id: user.id});
        const newBalance = userData.balance + amount;
        await queryRunner.manager.update(UserEntity, {id: user.id}, {balance : newBalance});
        await queryRunner.manager.insert(WalletEntity, {
            amount,
            type: walletType.Deposit,
            invoice_number: Date.now().toString(),
            userId: user.id
        })
        //commit
        await queryRunner.commitTransaction();
        await queryRunner.release();
    } catch (error) {
        //rollback
        console.log(error)
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
    }

    return {
        message: "payment successfully ✅"
    }
  }
}
