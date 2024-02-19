import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Quote {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  carModel: string;

  @Column()
  drivingExperience: number;

  @Column()
  price: number;
}
