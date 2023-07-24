import { Injectable } from '@nestjs/common';
import { ManagerChangePassDto, ManagerLoginDto, ManagerSignUpDto, ManagerUpdateInfoDto } from './manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerEntity } from './manager.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

const dashboard_options = [
  { label: 'Account Information',},
  { label: 'Change Password'},
];

@Injectable()
export class ManagerService 
{
  constructor(
    @InjectRepository(ManagerEntity)
    private managerRepo: Repository<ManagerEntity>,
   // private mailerService: MailerService,
   ) {}


   async managerAccDashboard(): Promise<any> {
    const labels = dashboard_options.map((option) => option.label);
    return labels;
    
}

  async managerSignUp(manager: ManagerSignUpDto): Promise<any> 
  {
    const data = await this.managerRepo.findOneBy({email: manager.email});
    if(data) {
        return false;
      }
    else {
        const salt = await bcrypt.genSalt();
        manager.password = await bcrypt.hash(manager.password, salt);
        const { name, email, password, contact, gender } = manager;
        const newmanager = { name, email, password, contact, gender };
        await this.managerRepo.save(newmanager);
        return true;
      }
  }

  async managerLogin(manager: ManagerLoginDto): Promise<any> {
    const data = await this.managerRepo.findOneBy({email: manager.email});
    if(data) {
        const isMatch = await bcrypt.compare(manager.password, data.password);
        if(isMatch) {
            return 'login successful';
        }
        else {
            return 'incorrect password';
        }
    }
    else {
        return 'email does not exist';
    }
}

async managerAccountInfo(email: string): Promise<ManagerEntity> {
  const entry = await this.managerRepo
      .createQueryBuilder('manager')
      .select(['manager.name', 'manager.email', 'manager.contact', 'manager.gender', 'manager.address',])
      .where('manager.email = :email', { email })
      .getOne();
  return entry;
}

async updateManagerInfo(manager: ManagerUpdateInfoDto, email: string): Promise<any> {
  const data = await this.managerRepo.findOneBy({email: email});
  const newmanager = Object.fromEntries(
      Object.entries(manager).filter(([key, val]) => val !== null && val !== undefined && val.trim() !== '')
  );
  if('email' in newmanager) {
      const check = await this.managerRepo.findOneBy({email: newmanager.email});
      if(check && check.email !== email) {
          return 'email already exists, use another';
      } else {
          await this.managerRepo.update(data.id, newmanager);
          return 'acc updated with new email';
      }
  } else {
      await this.managerRepo.update(data.id, newmanager);
      return 'account updated successfully';
  }
}

async managerChangePass(manager: ManagerChangePassDto, email: string): Promise<any> {
  const data = await this.managerRepo.findOneBy({email: email});
  const isMatch = await bcrypt.compare(manager.password, data.password);
  if(isMatch) {
      if ( manager.password === manager.new_password ) {
          return 'new password cannot be same as old';
      } 
      else {
          if(manager.new_password !== manager.confirm_password) {
              return 'new passwords do not match';
          }
          else {
              const salt = await bcrypt.genSalt();
              manager.new_password = await bcrypt.hash(manager.new_password, salt);
              await this.managerRepo.update(data.id, {password: manager.new_password});
              return 'password changed successfully';
          }
      }
  } else {
      return 'current password is incorrect';
  }
}



}
