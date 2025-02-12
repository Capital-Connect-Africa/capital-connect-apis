import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { File } from 'src/files/entities/file.entity';
import { DealStageHistory } from './deal-stage-history.entity';

@Entity('deal-attachments')
export class DealAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DealStageHistory, (history) => history.attachments, {
    onDelete: 'CASCADE',
  })
  history: DealStageHistory;

  @ManyToOne(() => File, { nullable: false })
  attachment: File;
}
