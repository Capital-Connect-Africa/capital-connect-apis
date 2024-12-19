import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserReferralTable1734467031245 implements MigrationInterface {
    name = 'CreateUserReferralTable1734467031245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "referrals" ("id" SERIAL NOT NULL, "clicks" integer NOT NULL DEFAULT '0', "visits" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_ea9980e34f738b6252817326c08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "referredById" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1142607b5a447cd5ce23ef7798f" FOREIGN KEY ("referredById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1142607b5a447cd5ce23ef7798f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "referredById"`);
        await queryRunner.query(`DROP TABLE "referrals"`);
    }

}
