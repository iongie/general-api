import { Index, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { ulid } from 'ulid';
import { randomUUID } from 'crypto';

export abstract class CoreEntity {
  @Index('ix_ulid', { unique: true })
  @PrimaryColumn({
    type: 'char',
    length: 26,
    unique: true
  })
  id!: string;

  @BeforeInsert()
  assignUlid() {
    if (!this.id) this.id = ulid();
  }

  @CreateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at!: Date;

  static assignId<T extends CoreEntity>(obj: T): T {
    if (!obj.id) obj.id = randomUUID();
    return obj;
  }
}
