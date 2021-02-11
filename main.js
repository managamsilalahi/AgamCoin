import SHA256 from 'crypto-js/sha256.js'

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block {
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
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransactions = []
        this.miningReward = 100
    }

    createGenesisBlock() {
        return new Block('01/01/2021', 'Genesis Block', '0')
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions)
        block.mine(this.difficulty)

        console.log('Block successfully mined!')
        this.chain.push(block)

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction) {
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

            if (currentBlock.hash !== currentBlock.calculateHash() ||
                currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }

        return true
    }
}

let agamCoin = new Blockchain()
agamCoin.createTransaction(new Transaction('address1', 'address2', 100))
agamCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log('\nStarting the miner...')
agamCoin.minePendingTransactions('raja-address')
console.log('\nBalance of raja-address is', agamCoin.getBalanceOfAddress('raja-address'))

console.log('\nStarting the miner again...')
agamCoin.minePendingTransactions('raja-address')
console.log('\nBalance of raja-address is', agamCoin.getBalanceOfAddress('raja-address'))

