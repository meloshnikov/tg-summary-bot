import { Entity, PrimaryColumn, Column, Index } from "typeorm";

@Entity("settings")
@Index(["entityType", "entityId", "key"], { unique: true })
export class SettingsModel {
  @PrimaryColumn({ length: 20 })
  entityType!: string;

  @PrimaryColumn({ type: 'bigint' })
  entityId!: number;

  @PrimaryColumn({ length: 50 })
  key!: string;

  @Column({ type: 'text', nullable: true })
  value!: string | null;

  @Column({ type: 'bigint', nullable: true })
  lastModifiedBy?: number;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  lastModifiedAt!: Date;
}
