import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity('messages')
@Index(["chat_id", "user_id", "date", "expiration_date"])
export class MessageModel {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'bigint' })
  date!: number;

  @Column({ type: 'bigint' })
  user_id!: number;

  @Column({ type: 'bigint' })
  chat_id!: number;

  @Column({ type: 'text', nullable: true })
  text?: string;

  @Column({ type: 'bigint' })
  expiration_date!: number;
}
