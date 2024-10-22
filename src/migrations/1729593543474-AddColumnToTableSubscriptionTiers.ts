import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnToTableSubscriptionTiers1729593543474 implements MigrationInterface {
    name = 'AddColumnToTableSubscriptionTiers1729593543474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_tiers" ADD "features" text array NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_tiers" DROP COLUMN "features"`);
    }

}
