import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepositorty: Repository<UserEntity>
    ) {}


    async findById(id: number) {
        const user = await this.userRepositorty.findOneBy({id});
        if(!user) throw new NotFoundException('User not found');
        return user;
    }

    async findByMobile(mobile: string) {
        const user = await this.userRepositorty.findOneBy({mobile});
        if(!user) throw new NotFoundException('user not found ‼️');
        return user;
    }


    async create(userDto: CreateUserDto) {
        const {mobile} = userDto;
        let user = await this.userRepositorty.findOneBy({mobile});
        if(!user) {
            user = await this.userRepositorty.create(userDto);
            return await this.userRepositorty.save(user);
        }
        return user;
    }
}
