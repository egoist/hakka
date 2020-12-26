import { MigrationInterface, QueryRunner } from 'typeorm'

export class init1608889243136 implements MigrationInterface {
  name = 'init1608889243136'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "isRead" boolean, "data" jsonb NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "token" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastActiveAt" TIMESTAMP WITH TIME ZONE NOT NULL, "type" character varying NOT NULL, "value" character varying NOT NULL, "maxAge" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_1096f931c2f2d9bf9c3c858d630" UNIQUE ("value"), CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "node" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slug" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying, CONSTRAINT "UQ_e9c89f1e059861b0c4f897008d5" UNIQUE ("slug"), CONSTRAINT "PK_8c8caf5f29d25264abe9eaf94dd" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "topic" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "content" character varying NOT NULL, "authorId" integer NOT NULL, "nodeId" integer NOT NULL, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_topic_like" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "topicId" integer NOT NULL, CONSTRAINT "PK_0151dd46f30684c6fe1d0d01061" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying, "avatar" character varying, "bio" character varying, "github" character varying, "twitter" character varying, "website" character varying, "githubUserId" character varying, "googleUserId" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_c445acb0ecd41969b8a0955e13a" UNIQUE ("githubUserId"), CONSTRAINT "UQ_3a6d6e65d5678fd41783302bbb2" UNIQUE ("googleUserId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content" character varying NOT NULL, "topicId" integer NOT NULL, "authorId" integer NOT NULL, "parentId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_5bc4974a5ec06dd10c348bdb5ec" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_b6f2a8821db533df60c26491470" FOREIGN KEY ("nodeId") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_topic_like" ADD CONSTRAINT "FK_d4a2527fbbba34e21b1079de424" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_topic_like" ADD CONSTRAINT "FK_bee938ba73f54fe875fa83573d2" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_b57a5333a16e092c662bd8ff5fe" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`,
    )
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`,
    )
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_b57a5333a16e092c662bd8ff5fe"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_topic_like" DROP CONSTRAINT "FK_bee938ba73f54fe875fa83573d2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_topic_like" DROP CONSTRAINT "FK_d4a2527fbbba34e21b1079de424"`,
    )
    await queryRunner.query(
      `ALTER TABLE "topic" DROP CONSTRAINT "FK_b6f2a8821db533df60c26491470"`,
    )
    await queryRunner.query(
      `ALTER TABLE "topic" DROP CONSTRAINT "FK_5bc4974a5ec06dd10c348bdb5ec"`,
    )
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    )
    await queryRunner.query(`DROP TABLE "comment"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "user_topic_like"`)
    await queryRunner.query(`DROP TABLE "topic"`)
    await queryRunner.query(`DROP TABLE "node"`)
    await queryRunner.query(`DROP TABLE "token"`)
    await queryRunner.query(`DROP TABLE "notification"`)
  }
}
