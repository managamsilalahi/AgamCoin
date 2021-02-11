import SHA256 from 'crypto-js/sha256.js'

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
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
        this.difficulty = 5
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2021', 'Genesis Block', '0')
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mine(this.difficulty)
        this.chain.push(newBlock)
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

console.log('Mining Block 1...')
agamCoin.addBlock(new Block(1, '07/02/2021', { amount: 100 }))

console.log('Mining Block 2...')
agamCoin.addBlock(new Block(2, '08/02/2021', { amount: 1000 }))
