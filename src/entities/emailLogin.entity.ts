import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({tableName: 'EmailLogins'})
export default class EmailLogin {

  @PrimaryKey({ type: 'uuid' })
  id: string = crypto.randomUUID()

  @Property({type: 'text'})
  email: string

  @Property({type: 'datetime'})
  expiresAt: Date

  constructor(p : {email: string, expiresAt?: Date}) {
    const defaultLifetime = (60*60*24*1000)
    this.email = p.email
    this.expiresAt = p.expiresAt || new Date(new Date().getTime() + defaultLifetime)
  }
}
