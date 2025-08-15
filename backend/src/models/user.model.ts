import { Column, Model, Table } from "sequelize-typescript";

@Table
export class User extends Model{

    @Column({primaryKey : true , autoIncrement: true})
    userId : number;

    @Column
    name : string;

    @Column
    email : string;

    @Column
    password : string;
}