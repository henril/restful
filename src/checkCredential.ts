import Credential from "./entities/credential.entity.js";

const checkCredential = (password: string, credential: Credential) => {
    const other: Credential = Object.create(credential);

    return other.calculateHash(password) === credential.hash;
}

export default checkCredential;
