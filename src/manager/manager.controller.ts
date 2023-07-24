import { Body, Controller, HttpStatus, Post,Get,UseGuards, Res, Session, UsePipes, ValidationPipe, HttpException, Patch } from '@nestjs/common';
import { ManagerChangePassDto, ManagerLoginDto, ManagerSignUpDto, ManagerUpdateInfoDto } from './manager.dto';
import { ManagerService } from 'src/manager/manager.service'
import { MSessionGuard } from './msession.guard';

@Controller()

export class ManagerController {
  constructor(private readonly managerService: ManagerService
    ) {}
  
    @Post('/signup')
    @UsePipes(new ValidationPipe())
    async managerSignUp(@Body() managerdto: ManagerSignUpDto): Promise<any> {
        try {
            if ( managerdto.password !== managerdto.confirm_password ){
                return 'passwords do not match';
            } else {
                const msg = await this.managerService.managerSignUp(managerdto);
                if (msg){
                    return 'successfully signed up';
                } else if (!msg){
                    return 'email already exists';
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

        
    @Post('/login')
    @UsePipes(new ValidationPipe())
    async managerLogin(@Body() managerdto: ManagerLoginDto, @Session() session, @Res() res): Promise<any> {
        try {
            const result = await this.managerService.managerLogin(managerdto);
            if(result == 'login successful'){
                session.email = managerdto.email;
                if (session.email !== undefined){
                    res.redirect('/account');
                } else {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'something went wrong while logging in' });
                }
            } else if(result == 'incorrect password' || result == 'email does not exist') {
                res.send(result);
            }
        } catch (error) {
            throw new Error(error.message);
        }

    }

    @Get('/account')
    @UseGuards (MSessionGuard)
    async managerDashboard(): Promise<any> {
        try {
            return await this.managerService.managerAccDashboard();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('/account/info')
    @UseGuards(MSessionGuard)
    async managerAccountInfo(@Session() session): Promise<any> {
        try {
            return await this.managerService.managerAccountInfo(session.email);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    

    @Get('/account/logout')
    @UseGuards(MSessionGuard)
    async managerLogout(@Session() session): Promise<any> {
        try {
            if(await session.destroy()) {
                return 'you have been logged out';
            }
            else {
                throw new HttpException("something went wrong while logging out", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Patch('/account/info/update')
    @UsePipes(new ValidationPipe())
    @UseGuards(MSessionGuard)
    async updateManagerInfo(@Body() managerdto: ManagerUpdateInfoDto, @Session() session): Promise<any> {
        try {
            const result = await this.managerService.updateManagerInfo(managerdto, session.email);
            if(result == 'email already exists, use another') {
                return result;
            } else if(result == 'acc updated with new email') {
                session.email = managerdto.email;
                return 'account updated successfully';
            } else if(result == 'account updated successfully') {
                return result;
            } else {
                throw new HttpException("something went wrong while updating account info", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Patch('/account/change-pass')
    @UsePipes(new ValidationPipe())
    @UseGuards(MSessionGuard)
    async managerChangePass(@Body() managerdto: ManagerChangePassDto, @Session() session): Promise<any> {
        try {
            const result = await this.managerService.managerChangePass(managerdto, session.email);
            if(result == 'new passwords do not match' || result == 'current password is incorrect' || result == 'password changed successfully' || result == 'new password cannot be same as old'){
                return result;
            } else {
                throw new HttpException("something went wrong while changing password", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
  

