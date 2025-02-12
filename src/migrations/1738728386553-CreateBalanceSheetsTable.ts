import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBalanceSheetsTable1738728386553 implements MigrationInterface {
    name = 'CreateBalanceSheetsTable1738728386553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "balance_sheets" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "landProperty" bigint NOT NULL DEFAULT '0', "plantEquipment" bigint NOT NULL DEFAULT '0', "otherNonCurrentAssets" bigint NOT NULL DEFAULT '0', "tradeReceivables" bigint NOT NULL DEFAULT '0', "cash" bigint NOT NULL DEFAULT '0', "inventory" bigint NOT NULL DEFAULT '0', "otherCurrentAssets" bigint NOT NULL DEFAULT '0', "totalAssets" bigint NOT NULL DEFAULT '0', "tradePayables" bigint NOT NULL DEFAULT '0', "otherCurrentLiabilities" bigint NOT NULL DEFAULT '0', "loans" bigint NOT NULL DEFAULT '0', "capital" bigint NOT NULL DEFAULT '0', "otherNonCurrentLiabilities" bigint NOT NULL DEFAULT '0', "totalLiabilities" bigint NOT NULL DEFAULT '0', "companyId" integer, CONSTRAINT "PK_3b5fdaa4d3bf947a0d52e71716b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "balance_sheets" ADD CONSTRAINT "FK_342cb5967cf21e5d49c0b1b477a" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balance_sheets" DROP CONSTRAINT "FK_342cb5967cf21e5d49c0b1b477a"`);
        await queryRunner.query(`DROP TABLE "balance_sheets"`);
    }
}
