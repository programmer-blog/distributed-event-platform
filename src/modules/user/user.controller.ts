import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(Number(id), dto);
  }
}
