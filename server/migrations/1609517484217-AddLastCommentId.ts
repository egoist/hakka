import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddLastCommentId1609517484217 implements MigrationInterface {
  name = 'AddLastCommentId1609517484217'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "topic" ADD "lastCommentId" integer`)
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "UQ_1ac9851d7efd0de4f3a171bbcff" UNIQUE ("lastCommentId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_1ac9851d7efd0de4f3a171bbcff" FOREIGN KEY ("lastCommentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic" DROP CONSTRAINT "FK_1ac9851d7efd0de4f3a171bbcff"`,
    )
    await queryRunner.query(
      `ALTER TABLE "topic" DROP CONSTRAINT "UQ_1ac9851d7efd0de4f3a171bbcff"`,
    )
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "lastCommentId"`)
  }
}
