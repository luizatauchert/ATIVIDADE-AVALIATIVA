import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
  } from "typeorm";
  import bcrypt from "bcryptjs";
  
  @Entity("users")
  export class User {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;
  
    @Column({ unique: true, nullable: false })
    email: string;
  
    @Column({ type: "varchar", length: 255, nullable: false })
    password: string;
  
    private _previousPassword: string;
  
    constructor(name: string, email: string, password: string) {
      this.name = name;
      this.email = email;
      this.password = password;
      this._previousPassword = password;
    }
  
    @AfterLoad()
    setPreviousPassword() {
      this._previousPassword = this.password;
    }
  
    @BeforeInsert()
    async hashPasswordBeforeInsert() {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  
    @BeforeUpdate()
    async hashPasswordBeforeUpdate() {
      if (this.password !== this._previousPassword) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    }
  }