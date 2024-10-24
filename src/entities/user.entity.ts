import { Cascade, Entity, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import Credential from './credential.entity.js';

@Entity({tableName: 'Users'})
export default class User {

  @PrimaryKey({ type: 'uuid' })
  id: string = crypto.randomUUID();

  @Property({type: 'text'})
  @Unique()
  name: string;

  @OneToOne('Credential', {mappedBy: 'user', cascade: [Cascade.REMOVE]})
  credential: Credential;

  constructor(name: string, credential: Credential) {
    this.name = name;
    this.credential = credential;
  }
}