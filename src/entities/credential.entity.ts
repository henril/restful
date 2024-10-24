import { Cascade, Entity, OneToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core'
import User from './user.entity.js';
import { pbkdf2Sync, randomBytes } from 'crypto';

interface HashOptions {
    iterations?: number;
    key_length?: number;
    digest?: string;
    salt?: string;
}

@Entity({tableName: 'Credentials'})
export default class Credential {

    constructor(password: string, {salt = void 0, iterations = 10000, key_length = 128, digest = 'sha256'}: HashOptions = {}) {
        this.iterations = iterations;
        this.key_length = key_length;
        this.digest = digest;
        this.salt = salt || randomBytes(16).toString('base64');
        this.hash = this.calculateHash(password);
    }

    @PrimaryKey({ type: 'uuid' })
    id: string = crypto.randomUUID();

    @Property({type: 'text'})
    hash: string;

    @Property({type: 'text'})
    salt: string;

    @Property({type: 'int'})
    iterations: number;

    @Property({type: 'int'})
    key_length: number;

    @Property({type: 'text'})
    digest: string;

    @OneToOne('User', {inversedBy: 'credential', cascade: [Cascade.REMOVE]})
    user!: Rel<User>;

    calculateHash(password: string) {
        return pbkdf2Sync(password, this.salt, this.iterations, this.key_length, this.digest).toString("base64");
    }

}