import elliptic from 'elliptic'
const ec = new elliptic.ec('secp256k1')

const key = ec.genKeyPair()
const publicKey = key.getPublic('hex')
const privateKey = key.getPrivate('hex')

console.log('Public key:', publicKey)
console.log('Private key:', privateKey)