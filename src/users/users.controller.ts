import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AbilityGuard } from 'src/auth/guards/ability.guard';
import { Action } from 'src/shared/enums/ability.types';
import { CheckAbility } from 'src/auth/decorators/ability.decorator';

@UseGuards(JwtAuthGuard, AbilityGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-new-user')
  @CheckAbility({ action: Action.Create, subject: 'User' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createNewUser(createUserDto);
  }

  @Get()
  @CheckAbility({ action: Action.List, subject: 'User' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckAbility({ action: Action.View, subject: 'User' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @CheckAbility({ action: Action.Update, subject: 'User' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @CheckAbility({ action: Action.Delete, subject: 'User' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
