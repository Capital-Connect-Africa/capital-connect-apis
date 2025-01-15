import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserReferral1736923019449 implements MigrationInterface {
    name = 'CreateTableUserReferral1736923019449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "referrals" ("id" SERIAL NOT NULL, "clicks" integer NOT NULL DEFAULT '0', "visits" integer NOT NULL DEFAULT '0', "userId" integer, CONSTRAINT "REL_2f8fb8a07f16dea31f65be9955" UNIQUE ("userId"), CONSTRAINT "PK_ea9980e34f738b6252817326c08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "referrerId" integer`);
        await queryRunner.query(`ALTER TABLE "referrals" ADD CONSTRAINT "FK_2f8fb8a07f16dea31f65be9955d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_01d209a8373b77bca9e6e2190d0" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_01d209a8373b77bca9e6e2190d0"`);
        await queryRunner.query(`ALTER TABLE "referrals" DROP CONSTRAINT "FK_2f8fb8a07f16dea31f65be9955d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "referrerId"`);
        await queryRunner.query(`DROP TABLE "referrals"`);
    }

}
