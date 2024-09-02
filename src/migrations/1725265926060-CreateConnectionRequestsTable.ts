import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConnectionRequestsTable1725265926060 implements MigrationInterface {
    name = 'CreateConnectionRequestsTable1725265926060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "connection_requests" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "isApproved" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "investorProfileId" integer, "companyId" integer, CONSTRAINT "UQ_572a3a3ed77e165037ab0508248" UNIQUE ("uuid"), CONSTRAINT "PK_a10611f5c871549e66b94f9f252" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ADD CONSTRAINT "FK_9e90441e1e716ddb9c8f6169a0f" FOREIGN KEY ("investorProfileId") REFERENCES "investor_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ADD CONSTRAINT "FK_802e07257e70f60d02331ed40b8" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection_requests" DROP CONSTRAINT "FK_802e07257e70f60d02331ed40b8"`);
        await queryRunner.query(`ALTER TABLE "connection_requests" DROP CONSTRAINT "FK_9e90441e1e716ddb9c8f6169a0f"`);
        await queryRunner.query(`DROP TABLE "connection_requests"`);
    }

}
