import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookingTable1737024086950 implements MigrationInterface {
    name = 'UpdateBookingTable1737024086950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ADD "meetingStartTime" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "meetingEndTime" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "meetingEndTime"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "meetingStartTime"`);
    }

}
