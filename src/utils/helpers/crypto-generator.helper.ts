import * as crypto from 'crypto';

export const generateCryptCode =(bytes: number =4) =>{
    return crypto.randomBytes(bytes).toString('hex')
}