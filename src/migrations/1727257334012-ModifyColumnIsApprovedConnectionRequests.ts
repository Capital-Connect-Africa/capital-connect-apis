import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyColumnIsApprovedConnectionRequests1727257334012 implements MigrationInterface {
    name = 'ModifyColumnIsApprovedConnectionRequests1727257334012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection_requests" ALTER COLUMN "isApproved" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ALTER COLUMN "isApproved" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection_requests" ALTER COLUMN "isApproved" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ALTER COLUMN "isApproved" SET NOT NULL`);
    }

}
