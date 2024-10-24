import { Migration } from '@mikro-orm/migrations';

export class Migration20241024193214 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "Users" ("id" uuid not null, "name" text not null, constraint "Users_pkey" primary key ("id"));`);
    this.addSql(`alter table "Users" add constraint "Users_name_unique" unique ("name");`);

    this.addSql(`create table "Credentials" ("id" uuid not null, "hash" text not null, "salt" text not null, "iterations" int not null, "key_length" int not null, "digest" text not null, "user_id" uuid null, constraint "Credentials_pkey" primary key ("id"));`);
    this.addSql(`alter table "Credentials" add constraint "Credentials_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "Credentials" add constraint "Credentials_user_id_foreign" foreign key ("user_id") references "Users" ("id") on delete cascade;`);
  }

}
