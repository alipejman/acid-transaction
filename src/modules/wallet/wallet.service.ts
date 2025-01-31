import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WalletEntity } from "./entity/wallet.entity";
import { DataSource, Repository } from "typeorm";
import { DepositDto, withdrawDto } from "./dto/wallet.dto";
import { UserEntity } from "../user/entity/user.entity";
import { UserService } from "../user/user.service";
import { walletType } from "./wallet.enum";
import { ProductsList } from "../products";

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

      let user = await this.userService.findByMobile(mobile);
      if (!user) {
        user = await this.userService.create({ mobile, fullname });
      }
      const userData = await queryRunner.manager.findOne(UserEntity, {
        where: { id: user.id },
      });
      const newBalance = (userData.balance || 0) + amount;
      await queryRunner.manager.update(
        UserEntity,
        { id: user.id },
        { balance: newBalance }
      );
      await queryRunner.manager.insert(WalletEntity, {
        amount,
        type: walletType.Deposit,
        invoice_number: Date.now().toString(),
        userId: user.id,
      });

      //commit
      await queryRunner.commitTransaction();
    } catch (error) {
      //rollback
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }

    return {
      message: "payment successfully ✅",
    };
  }

  async paymentWithWallet(withdrawDto: withdrawDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { productId, userId } = withdrawDto;
      const product = ProductsList.find((product) => product.id === productId);
      if (!product) throw new NotFoundException("product not found ‼️");
      const user = await queryRunner.manager.findOneBy(UserEntity, {
        id: userId,
      });
      if (!user) throw new NotFoundException("user not found ‼️");
      if (user.balance < product.price)
        throw new BadRequestException(
          "The amount of the wallet is not enough ❌"
        );
      const newBalance = user.balance - product.price;
      await queryRunner.manager.update(
        UserEntity,
        { id: userId },
        { balance: newBalance }
      );
      await queryRunner.manager.insert(WalletEntity, {
        amount: product.price,
        userId,
        reason: `payment for ${product.name}`,
        productId,
        invoice_number: Date.now().toString(),
        type: walletType.Withdraw,
      });

      //commit
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      //rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      if (error?.statusCode) {
        throw new HttpException(error.message, error?.statusCode);
      }
      throw new BadRequestException(error?.message);
    }
    return {
      message: "payment order successfully",
    };
  }
}
