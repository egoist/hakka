import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveNodeTable1617004201377 implements MigrationInterface {
  name = 'RemoveNodeTable1617004201377'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic" DROP CONSTRAINT "FK_b6f2a8821db533df60c26491470"`,
    )
    await queryRunner.query(
      `ALTER TABLE "topic" RENAME COLUMN "nodeId" TO "url"`,
    )
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "url"`)
    await queryRunner.query(`ALTER TABLE "topic" ADD "url" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "url"`)
    await queryRunner.query(`ALTER TABLE "topic" ADD "url" integer NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "topic" RENAME COLUMN "url" TO "nodeId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_b6f2a8821db533df60c26491470" FOREIGN KEY ("nodeId") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
