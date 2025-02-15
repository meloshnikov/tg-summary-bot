import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
@Index(["user_id"])
@Index(["chat_id", "date", "expiration_date"])
export class Messages {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'bigint' })
  user_id!: number;

  @Column()
  first_name!: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true, length: 10 })
  language_code?: string;

  @Column({ default: false })
  is_premium!: boolean;

  @Column({ type: 'bigint' })
  chat_id!: number;

  @Column()
  chat_title!: string;

  @Column({ length: 20 })
  chat_type!: string;

  @Column({ type: 'bigint' })
  date!: number;

  @Column({ type: 'text', nullable: true })
  text?: string;

  @Column({ type: 'bigint' })
  expiration_date!: number;
}
