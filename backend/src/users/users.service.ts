import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// 開発用
import { OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from './entities/user-role.enum';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  
  // User作成
  async create(createUserDto: CreateUserDto): Promise<void> {
    const { email, password, name, role } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role: role || UserRole.CUSTOMER,
    });
    try {
      await this.usersRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('このメールアドレスは既に使用されています');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // 全ユーザー取得(作成日古い順)
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
        order: { createdAt: 'ASC' }
    })
  }

  // idで1件取得
  async findOne(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({id})
  }

  // メールアドレスから取得
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  // 更新
  async update(id: string, user: Partial<User>) {
    return await this.usersRepository.update(id, user);
  }

  // 削除
  async remove(id: string) {
    return await this.usersRepository.delete(id)
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
        name: "admin1",
        role: UserRole.ADMIN,
      });
      console.log('Default Admin User Created: admin@example.com / admin123');
    }
  }
}