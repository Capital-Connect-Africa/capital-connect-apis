import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyBookingTable1733324880291 implements MigrationInterface {
    name = 'ModifyBookingTable1733324880291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ADD "advisor" integer`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_beed08dca258b06ff47c6dad400" FOREIGN KEY ("advisor") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_beed08dca258b06ff47c6dad400"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "advisor"`);
    }

}
