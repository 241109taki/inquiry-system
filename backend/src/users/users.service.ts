import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

// 開発用
import { OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findMyEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async create(UserData: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(UserData);
        return this.usersRepository.save(newUser);
    }

    async onModuleInit() {
        // 開発用
        if (process.env.NODE_ENV === 'production') return;
        const adminEmail = 'admin@example.com';
        const adminExists = await this.usersRepository.findOne({ where: { email: adminEmail } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await this.usersRepository.save({
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN,
            });
        console.log('🚀 Default Admin User Created: admin@example.com / admin123');
        }
    }
}