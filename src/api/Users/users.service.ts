import { BadRequestException, Body, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { Accounts } from 'src/db/Entitys/user.entity';
import { createUserDto } from 'src/api/dtos/createUserDto';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { loginUserDto } from 'src/api/dtos/loginDto';
import { JwtService } from '@nestjs/jwt';
import { resetPassDto } from '../dtos/resetPassDto';
import { AuthService } from 'src/auth/auth';
import { MailService } from 'src/lib/mail.service';

export interface loginInterface {
    id: number,
    access_token: string
}

export interface accountInterface{
    name: string
    email: string
}

export interface resetPassInterface {
    Message: string
}

@Injectable()
export class UsersService {

    constructor(
        @Inject('USER_REPOSITORY') private readonly userRepository: Repository<Accounts>,
        private jwtService: JwtService, private readonly reset: AuthService, private readonly mailService: MailService
    ){}

    // Create User
    async createUser(user: createUserDto): Promise<Accounts>{
        const passwordHash = await bcrypt.hash(user.password, 10)
        const dto = Object.assign(new createUserDto(), {
            ...user,
            password: passwordHash
        })
        try {
            return await this.userRepository.save(dto)
        } catch (error) {
            if (error instanceof Error){
                throw new BadRequestException(error.message)
            }
            throw new InternalServerErrorException('Fail to create User!')
        }   
    }

    // Reset Password
    async resetPass(user: resetPassDto): Promise<resetPassInterface>{

        const token = await this.reset.generateResetToken()
        this.mailService.sendPasswordReset(user.email, token)
        
        const a:resetPassInterface = {
            Message: "Verify your Email!"
        }
        return  a
    }

    // Login User
    async loginUser(user: loginUserDto): Promise<loginInterface> {
        const x = await this.userRepository.findOne({where: {email: user.email}})
        if (!x){
            throw new BadRequestException('User not found!')
        }
        const match = await bcrypt.compare(user.password, x?.password)
        if (!match){
            throw new UnauthorizedException('Invalid Password')
        }
        const r: loginInterface = {
            id:  x.id,
            access_token: await this.jwtService.signAsync({sub: x.id, username: x.name})
        }  
        return r
    }

    // Account User
    async getAccount(req): Promise<accountInterface>{
        const x = await this.userRepository.findOne({where: {id: req}, select: ['id', 'email', 'name']})
        if (!x) {
            throw new BadRequestException('User not Found!')
        }
        const d: accountInterface = {
            email: x.email,
            name: x.name
        }
        return d
    }

}
