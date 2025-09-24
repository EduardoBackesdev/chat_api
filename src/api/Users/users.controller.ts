import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from 'src/api/dtos/createUserDto';
import { loginUserDto } from 'src/api/dtos/loginDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { emailResetPassDto } from '../dtos/emailResetPassDto';
import { ResetPassDto } from '../dtos/resetPassDto';

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
    @Post('/emailResetPassword')
    async emailResetPassword(@Body() user: emailResetPassDto){
        const a = this.usersService.emailResetPass(user)
        return a
    }

    // Change password with forgot password
    @Post('resetPassword')
    async resetPassword(@Body() user: ResetPassDto){
        await this.usersService.resetPassword(user)
        return {
            Message: 'Password changed with success!'
        }
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
