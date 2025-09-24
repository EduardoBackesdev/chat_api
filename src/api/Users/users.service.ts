import { BadRequestException, Body, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { Accounts } from 'src/db/Entitys/user.entity';
import { createUserDto } from 'src/api/dtos/createUserDto';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { loginUserDto } from 'src/api/dtos/loginDto';
import { JwtService } from '@nestjs/jwt';
import { emailResetPassDto } from '../dtos/emailResetPassDto';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/lib/mail.service';
import { MailToken } from 'src/db/Entitys/mail.entity';
import { TokenDto } from '../dtos/tokenDto';
import { ResetPassDto } from '../dtos/resetPassDto';

export interface loginInterface {
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
        @Inject('USER_REPOSITORY') 
        private readonly userRepository: Repository<Accounts>,
        @Inject('MAIL_REPOSITORY')
        private readonly mailRepository: Repository<MailToken>,
        private jwtService: JwtService, 
        private readonly reset: AuthService, 
        private readonly mailService: MailService
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

    // Email reset Password
    async emailResetPass(user: emailResetPassDto): Promise<resetPassInterface>{
        const token = await this.reset.generateResetToken()
        await this.mailService.sendPasswordReset(user.email, token)
        const now = new Date(Date.now() + 15 * 60 * 1000)
        const id_user = await this.userRepository.findOne({where: {email: user.email}})
        if (!id_user){
            throw new BadRequestException('Not user found')
        }
        const query = Object.assign(new TokenDto(), {
            id_user: id_user?.id,
            token: token,
            expiration: now
        })
        await this.mailRepository.save(query)
        const a:resetPassInterface = {
            Message: "Verify your Email!"
        }
        return  a
    }

    // Reset Password
    async resetPassword(user: ResetPassDto){
        const query = await this.mailRepository.findOne({where: {token: user.token}, order:{expiration: 'DESC'}})
        if (!query){
            throw new BadRequestException('Token not found !')
        }
        const now = new Date()
        if (now > query.expiration){
            throw new BadRequestException('Token Expired!')
        }
        const userQuery = await this.userRepository.findOne({where: {id: query.id_user}})
        if(!userQuery){
            throw new BadRequestException('User not found!')
        } 
        const comparePass = await bcrypt.compare(user.actualPass, userQuery.password)
        if (!comparePass){
            throw new BadRequestException('Invalid actual password!')
        }
        try {
            const newPass = await bcrypt.hash(user.newPass, 10)
            await this.userRepository.update({id: query.id_user},{password: newPass})
        } catch (error) {
            throw new BadRequestException('Error with change password')
        }
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
