import { Blockchain, Transaction } from './blockchain.js'
import elliptic from 'elliptic'
const ec = new elliptic.ec('secp256k1')

const myKey = ec.keyFromPrivate('ba7fc044862361d7f161dcba871a8054bf1990a0422a951e45c4a04f0a38bf1b')
const myWalletAddress = myKey.getPublic('hex')

const herKey = ec.keyFromPrivate('01c0c2819f772c8173ff1b01425bbe3caa39527aa224e63551b4693333a4b618')
const herWalletAddress = herKey.getPublic('hex')

let agamCoin = new Blockchain()

const tx1 = new Transaction(myWalletAddress, herWalletAddress, 10)
tx1.signTransaction(myKey)
agamCoin.addTransaction(tx1)

console.log('\nStarting the miner...')
agamCoin.minePendingTransactions(myWalletAddress)
console.log('\nMy balance is:', agamCoin.getBalanceOfAddress(myWalletAddress))
console.log('Her balance is:', agamCoin.getBalanceOfAddress(herWalletAddress))

const tx2 = new Transaction(herWalletAddress, myWalletAddress, 40)
tx2.signTransaction(herKey)
agamCoin.addTransaction(tx2)

console.log('\nStarting the miner again...')
agamCoin.minePendingTransactions(herWalletAddress)
console.log('\nMy balance is:', agamCoin.getBalanceOfAddress(myWalletAddress))
console.log('Her balance is:', agamCoin.getBalanceOfAddress(herWalletAddress))