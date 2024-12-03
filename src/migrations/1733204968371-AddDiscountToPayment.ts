import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDiscountToPayment1733204968371 implements MigrationInterface {
    name = 'AddDiscountToPayment1733204968371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "discount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "discount"`);
    }

}
