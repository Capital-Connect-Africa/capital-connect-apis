import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableSubscriptionTiers1726750603752 implements MigrationInterface {
    name = 'CreateTableSubscriptionTiers1726750603752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscription_tiers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_f5bb908755354652f05d96a7f2f" UNIQUE ("name"), CONSTRAINT "PK_376aa3503bf3278d69af3d711b7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subscription_tiers"`);
    }

}
