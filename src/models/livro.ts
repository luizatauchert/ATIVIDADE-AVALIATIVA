import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
  } from "typeorm";
  
  @Entity("livro")
  export class Livro {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;
  
    @Column({ type: "varchar", length: 255, nullable: false })
    tipo: string;
  
    @Column({ type: "int", nullable: false })
    ano: number;
  
    constructor(name: string, tipo: string, ano: number) {
      this.name = name;
      this.tipo = tipo;
      this.ano = ano;
    }
  }