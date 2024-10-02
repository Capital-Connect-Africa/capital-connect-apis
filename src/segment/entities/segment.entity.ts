import { SubSector } from "src/subsector/entities/subsector.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('segments')
export class Segment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => SubSector, (subSector) => subSector.segments, {
        onDelete: 'CASCADE',
    })
    subSector: SubSector;
}
