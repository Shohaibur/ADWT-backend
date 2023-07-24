import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ManagerEntity{
  @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'name', type: "varchar", length: 100})
    name: string;

    @Column({name:'email', type: "varchar", length: 100})
    email: string;

    @Column({name:'password', type: "varchar", length: 999})
    password: string;

    @Column({name:'contact', type: "varchar", length: 11})
    contact: string;

    @Column({name:'gender', type: "varchar", length: 10})
    gender: string;

    @Column({name:'address', nullable: true, type: "varchar", length: 150})
    address: string;

}