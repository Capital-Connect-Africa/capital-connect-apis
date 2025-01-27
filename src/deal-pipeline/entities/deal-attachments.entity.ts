import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Deal } from './deal.entity';
import { File } from 'src/files/entities/file.entity';

@Entity('deal-attachments')
export class DealAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Deal, (deal) => deal.attachments, { nullable: false })
  deal: Deal;

  @ManyToOne(() => File, { nullable: false })
  attachment: File;
}
