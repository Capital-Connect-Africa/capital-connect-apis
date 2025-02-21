import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCashflowsTable1739933988719 implements MigrationInterface {
    name = 'CreateCashflowsTable1739933988719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cashflows" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "profitBeforeTax" bigint NOT NULL DEFAULT '0', "depreciationAmortisation" bigint NOT NULL DEFAULT '0', "taxesPaid" bigint NOT NULL DEFAULT '0', "operatingCashFlow" bigint NOT NULL DEFAULT '0', "changeInReceivables" bigint NOT NULL DEFAULT '0', "changeInPayables" bigint NOT NULL DEFAULT '0', "netCashFromOperations" bigint NOT NULL DEFAULT '0', "propertyPlantEquipment" bigint NOT NULL DEFAULT '0', "netCashFromInvesting" bigint NOT NULL DEFAULT '0', "movementInBorrowings" bigint NOT NULL DEFAULT '0', "changeInEquity" bigint NOT NULL DEFAULT '0', "netCashFromFinancing" bigint NOT NULL DEFAULT '0', "netCashFlow" bigint NOT NULL DEFAULT '0', "openingCash" bigint NOT NULL DEFAULT '0', "endingCash" bigint NOT NULL DEFAULT '0', "companyId" integer, "balanceSheetId" integer, "financesId" integer, CONSTRAINT "PK_bee5495848b3fe5df4dcd0f9b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cashflows" ADD CONSTRAINT "FK_f6501b2b46872bff8f8c1d3edd7" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cashflows" ADD CONSTRAINT "FK_526a4d44f95ba02ddf4d0f43e9e" FOREIGN KEY ("balanceSheetId") REFERENCES "balance_sheets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cashflows" ADD CONSTRAINT "FK_3493ff8d46bcf89c4e3029d0691" FOREIGN KEY ("financesId") REFERENCES "finances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cashflows" DROP CONSTRAINT "FK_3493ff8d46bcf89c4e3029d0691"`);
        await queryRunner.query(`ALTER TABLE "cashflows" DROP CONSTRAINT "FK_526a4d44f95ba02ddf4d0f43e9e"`);
        await queryRunner.query(`ALTER TABLE "cashflows" DROP CONSTRAINT "FK_f6501b2b46872bff8f8c1d3edd7"`);
        await queryRunner.query(`DROP TABLE "cashflows"`);
    }

}
