import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyReferralsAddUserId1734504449531 implements MigrationInterface {
    name = 'ModifyReferralsAddUserId1734504449531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referrals" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "referrals" ADD CONSTRAINT "UQ_2f8fb8a07f16dea31f65be9955d" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "referrals" ADD CONSTRAINT "FK_2f8fb8a07f16dea31f65be9955d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referrals" DROP CONSTRAINT "FK_2f8fb8a07f16dea31f65be9955d"`);
        await queryRunner.query(`ALTER TABLE "referrals" DROP CONSTRAINT "UQ_2f8fb8a07f16dea31f65be9955d"`);
        await queryRunner.query(`ALTER TABLE "referrals" DROP COLUMN "userId"`);
    }

}
