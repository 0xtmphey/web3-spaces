import { filesFromPaths } from 'files-from-path'
import { createPublicClient, http, getContract } from 'viem'
import { mainnet } from 'viem/chains'
import {
    create as createName,
    publish as publishName,
    v0,
    Revision,
    increment,
    from as fromKey,
} from 'w3name'
import { ipnsValue } from './utils.js'
import * as db from './db.js'
import { abi, contractAddress } from './onchain/contract.js'

export const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
})

export async function prepareMint(
    storageClient,
    params
) {

    // 1. Verify signature
    const isSignatureValid = await publicClient.verifyMessage(params)

    if (!isSignatureValid) {
        throw new Error('Signature is invalid')
    }

    // 2. Upload template to IPFS
    const file = (await filesFromPaths(['./template.json']))[0]
    const cid = await storageClient.uploadFile(file)

    // 3. Create IPNS record
    const name = await createName()
    const revision = await v0(name, ipnsValue(cid))
    await publishName(revision, name.key)

    // 4. Put everything to db
    let revisionBytes = Revision.encode(revision)
    let keyBytes = name.key.bytes

    await db.createRecord(name.toString(), params.address, keyBytes, revisionBytes)

    return name.toString()
}

async function onMintSuccess(
    tokenId,
    minterAddress
) {

}

/**
 * 1. Verify signature
 * 2. Verify token owner
 * 3. Upload newData to IPFS
 * 4. Retieve key and revision from DB
 * 5. Update IPNS record
 * 6. Save new revision to DB
 */
export async function updateSpace(
    storageClient,
    params,
    tokenID,
    newSpaceData
) {
    // 1. Verify signature
    const isSignatureValid = await publicClient.verifyMessage(params)
    if (!isSignatureValid) {
        throw new Error('Signature is invalid')
    }

    // 2. Verify token owner
    const contract = getContract({
        address: contractAddress,
        abi: abi,
        client: publicClient
    })

    const tokenOwner = await contract.read.ownerOf([BigInt(tokenID)])
    if (tokenOwner !== params.address) {
        throw new Error('forbidden operation')
    }

    // 3. Upload new data to IPFS
    const blob = new Blob([JSON.stringify(newSpaceData)], { type: 'application/json' })
    const file = new File([blob], 'data.json')
    const cid = await storageClient.uploadFile(file)

    // 4. Retieve key and revision from DB
    const { key, last_revision } = await db.getRecordForToken(tokenID)
    const name = await fromKey(key)
    const oldRevision = Revision.decode(last_revision)


    // 5. Update IPNS record
    const nextRevision = await increment(oldRevision, ipnsValue(cid))
    await publishName(nextRevision, name.key)

    // // 6. Update DB
    await db.updateRevisionFor(tokenID, Revision.encode(nextRevision))
}

