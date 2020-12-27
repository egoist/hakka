import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserCommentLikeTable1609051015774
  implements MigrationInterface {
  name = 'AddUserCommentLikeTable1609051015774'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_comment_like" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "commentId" integer NOT NULL, CONSTRAINT "PK_13a8aff1084e84161eaf9a205f3" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment_like" ADD CONSTRAINT "FK_72725a6b118ede500319a7da942" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment_like" ADD CONSTRAINT "FK_7306a7964c2deec80aba41aa7fb" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_comment_like" DROP CONSTRAINT "FK_7306a7964c2deec80aba41aa7fb"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_comment_like" DROP CONSTRAINT "FK_72725a6b118ede500319a7da942"`,
    )
    await queryRunner.query(`DROP TABLE "user_comment_like"`)
  }
}
