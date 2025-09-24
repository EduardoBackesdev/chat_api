import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from 'src/api/dtos/createUserDto';
import { loginUserDto } from 'src/api/dtos/loginDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { resetPassDto } from '../dtos/resetPassDto';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class UsersController {

    constructor(private readonly usersService: UsersService){}
 
    // Create User
    @Post('/createUser')
    async createUser(@Body() user: createUserDto){
        await this.usersService.createUser(user)
        return {message: "User created with success!"}
    }

    // Forgot password
    @Post('/resetPassword')
    async resetPassword(@Body() user: resetPassDto){
        const a = this.usersService.resetPass(user)
        return a
    }

    // Login User
    @Post('/login')
    async loginUser(@Body() user: loginUserDto){
        const a = await this.usersService.loginUser(user)
        return {
            message: "Login success",
            data: a
        }
    }

    @UseGuards(AuthGuard)
    // Account User
    @Get('/account')
    async getAccount(@Request() req){
        const r = await this.usersService.getAccount(req.user.sub)
        return {
            message: "User found!",
            data: r
        }
    }

}
