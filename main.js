import SHA256 from "crypto-js/sha256.js"

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2021", "Genesis Block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.calculateHash()
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
agamCoin.addBlock(new Block(1, "07/02/2021", { amount: 100 }))
agamCoin.addBlock(new Block(2, "08/02/2021", { amount: 1000 }))

console.log(`Is AgamCoin valid? ${agamCoin.isValid()}`)

agamCoin.chain[1].data = { amount: 10 }
agamCoin.chain[1].hash = agamCoin.chain[1].calculateHash()

console.log(`Is AgamCoin valid? ${agamCoin.isValid()}`)

// console.log(JSON.stringify(agamCoin, null, 4))
