import SHA256 from 'crypto-js/sha256.js'
import elliptic from 'elliptic'
const ec = new elliptic.ec('secp256k1')

export class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transaction for other wallets!')
        }
        
        const hashTx = this.calculateHash()
        const sig = signingKey.sign(hashTx, 'base64')
        this.signature = sig.toDER('hex')
    }

    isValid() {
        if (this.fromAddress === null) {
            return true
        } else if (!this.signature || this.signature.length === 0) {
            throw Error('No signature in this transaction')
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}

export class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mine(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce += 1
            this.hash = this.calculateHash()
        }

        console.log('Block mined: ' + this.hash)
    }

    hasValidTransactions() {
        for (const transaction of this.transactions) {
            if (!transaction.isValid()) {
                return false
            }
        }

        return true
    }
}

export class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransactions = []
        this.miningReward = 100
    }

    createGenesisBlock() {
        return new Block(Date.parse('2021-01-01'), [], '0')
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward)
        this.pendingTransactions.push(rewardTx)
        
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
        block.mine(this.difficulty)

        console.log('Block successfully mined!')
        this.chain.push(block)

        this.pendingTransactions = []
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transactin must include from and to address')
        } else if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to the chain')
        }
        
        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address) {
        let balance = 0

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount
                } else if (transaction.toAddress === address) {
                    balance += transaction.amount
                }
            }
        }

        return balance
    }

    isValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (!currentBlock.hasValidTransactions() ||
                currentBlock.hash !== currentBlock.calculateHash() ||
                currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }

        return true
    }
}
