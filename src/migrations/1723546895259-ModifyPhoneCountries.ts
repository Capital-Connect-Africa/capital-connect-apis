import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyPhoneCountries1723546895259 implements MigrationInterface {
    name = 'ModifyPhoneCountries1723546895259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "countries" ADD "phoneCode" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "countries" DROP COLUMN "phoneCode"`);
    }

}
