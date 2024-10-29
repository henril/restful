import { Cascade, Entity, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core'
import Credential from './credential.entity.js';

@Entity({tableName: 'Users'})
export default class User {

  @PrimaryKey({ type: 'uuid' })
  id: string = crypto.randomUUID();

  @Property({type: 'text'})
  @Unique()
  name: string;

  @Property({type: 'text'})
  @Unique()
  email: string;

  @OneToOne('Credential', {mappedBy: 'user', cascade: [Cascade.REMOVE]})
  credential?: Credential;

  constructor(p: {name: string, credential?: Credential, email: string}) {
    this.name = p.name
    this.credential = p.credential
    this.email = p.email
  }
}