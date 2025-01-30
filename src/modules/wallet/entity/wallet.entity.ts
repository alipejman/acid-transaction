import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { walletType } from "../wallet.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";

@Entity("wallet")
export class WalletEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column({type: "enum", enum: walletType})
    type: string   
    @Column()
    invoice_number: string;
    @Column()
    amount: number;
    @CreateDateColumn()
    created_at: Date;
    @Column()
    userId: number;
    @ManyToMany(() => UserEntity, user => user.transactions, {onDelete: "CASCADE"})
    user: UserEntity[];
}