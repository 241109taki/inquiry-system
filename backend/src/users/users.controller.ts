import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Request } from "@nestjs/common";
import { UserService } from "./users.service";
import { User, UserRole } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";


@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UserService) {}
  
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
        throw new ForbiddenException('他人のデータは閲覧できません');
    }
    return this.usersService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
        throw new ForbiddenException('権限がありません');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  

}