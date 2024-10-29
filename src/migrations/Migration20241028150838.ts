import { Migration } from '@mikro-orm/migrations';

export class Migration20241028150838 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "EmailLogins" ("id" uuid not null, "email" text not null, "expires_at" timestamptz not null, constraint "EmailLogins_pkey" primary key ("id"));`);

    this.addSql(`alter table "Users" add column "email" text not null;`);
    this.addSql(`alter table "Users" add constraint "Users_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "EmailLogins" cascade;`);

    this.addSql(`alter table "Users" drop constraint "Users_email_unique";`);
    this.addSql(`alter table "Users" drop column "email";`);
  }

}
