import { Company } from "src/company/entities/company.entity";
import { InvestorProfile } from "src/investor-profile/entities/investor-profile.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('connection_requests')
export class ConnectionRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', unique: true })
    uuid: string;

    @ManyToOne(() => InvestorProfile, (investorProfile) => investorProfile.connectionRequests)
    investorProfile: InvestorProfile;

    @ManyToOne(() => Company, (company) => company.connectionRequests)
    company: Company;

    @Column({ default: false })
    isApproved: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateUuid() {
      this.uuid = uuidv4();
    }
}
