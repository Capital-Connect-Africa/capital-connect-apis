import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyDeclineReasonsMatchmaking1724060789032 implements MigrationInterface {
    name = 'ModifyDeclineReasonsMatchmaking1724060789032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_makings" ADD "declineReasons" text array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_makings" DROP COLUMN "declineReasons"`);
    }

}
