import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      const user = await this.userService.findOne(req.user.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const {
        resetPasswordToken,
        resetPasswordExpires,
        isEmailVerified,
        emailVerificationToken,
        emailVerificationExpires,
        password,
        ...rest
      } = user;
      return {...rest, referralId: this.jwtService.sign({userId: user.id})};
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Admin)
  getAllUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('role')
  @Roles(Role.Admin)
  async getUsersByRole(
    @Query('usertype') usertype: string, 
    @Query('page') page: number, @Query('limit') limit: number
  ): Promise<any[]> {
    if (!Object.values(Role).includes(usertype as Role)) {
      throw new BadRequestException(`Invalid role: ${usertype}`);
    }
  
    return await this.userService.findAllByUserType(usertype as Role, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @Roles(Role.Admin, Role.Investor, Role.User, Role.ContactPerson)
  async updateUser(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      if (+id !== req.user.id)
        return new UnauthorizedException(
          'You are not authorized to update this user.',
        );
      return await this.userService.update(+id, updateUserDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/admin')
  @Roles(Role.Admin)
  async updateUserByAdmin(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserAdminDto,
  ) {
    try {
      return await this.userService.updateByAdmin(+id, updateUserDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<void> {
    try {
      await this.userService.requestPasswordReset(
        requestResetPasswordDto.email,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    try {
      await this.userService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<void> {
    try {
      if (!token) {
        throw new BadRequestException('Token is required');
      }
      await this.userService.verifyEmail(token);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.Admin)
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(+id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const {
        resetPasswordToken,
        resetPasswordExpires,
        isEmailVerified,
        emailVerificationToken,
        emailVerificationExpires,
        password,
        ...rest
      } = user;
      return rest;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throwInternalServer(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept-terms')
  async acceptTerms(@Request() req, @Param('id') id: number) {
    if (+id !== req.user.id) {
      throw new UnauthorizedException(
        'You are not authorized to accept terms and conditions for this user',
      );
    }

    try {
      await this.userService.acceptTerms(id);
      return { message: 'Terms and conditions accepted' };
    } catch (error) {
      throwInternalServer(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.userService.remove(+id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throwInternalServer(error);
    }
  }
}
