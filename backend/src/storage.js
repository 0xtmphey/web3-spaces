import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import { importDAG } from '@ucanto/core/delegation'
import { CarReader } from '@ipld/car'
import * as Signer from '@ucanto/principal/ed25519'
import { Client, create } from '@web3-storage/w3up-client'

const key = process.env.DELEGATION_KEY
const proof_raw = process.env.PROOF

var client = null

async function createClient() {
    const principal = Signer.parse(key)
    const store = new StoreMemory()

    client = await create({ principal, store })

    const proof = await parseProof(proof_raw)
    const space = await client.addSpace(proof)

    await client.setCurrentSpace(space.did())

    return client
}

/** @param {string} data Base64 encoded CAR file */
async function parseProof(data) {
    const blocks = []
    const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
    for await (const block of reader.blocks()) {
        blocks.push(block)
    }
    return importDAG(blocks)
}

export async function getStorageClient() {
    if (client) return client

    return createClient()
}