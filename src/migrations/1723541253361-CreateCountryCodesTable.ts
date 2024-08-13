import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCountryCodesTable1723541253361 implements MigrationInterface {
    name = 'CreateCountryCodesTable1723541253361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "country-codes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "UQ_b7146a6824be1872b4ff817405b" UNIQUE ("name"), CONSTRAINT "PK_e1c21bfe1e321db838f62e5412b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "country-codes"`);
    }

}
