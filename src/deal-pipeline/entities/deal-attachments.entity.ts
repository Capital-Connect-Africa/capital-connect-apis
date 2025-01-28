import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { File } from 'src/files/entities/file.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import { Deal } from './deal.entity';

@Entity('deal-attachments')
export class DealAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Deal, (deal) => deal.attachments)
  deal: Deal;

  @ManyToOne(() => Stage, { nullable: true, onDelete: 'SET NULL' })
  stage: Stage;

  @ManyToOne(() => File, { nullable: false })
  attachment: File;
}
