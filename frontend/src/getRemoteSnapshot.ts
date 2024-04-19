import * as Name from 'w3name'
import { ConnectPublicClient } from './onchain/client'
import { getContract } from 'viem'
import { contractAddress, spacesAbi } from './onchain/spacesApi'

export async function getRemoteSnapshot(tokenId: string): Promise<any> {
    const publicClient = ConnectPublicClient()
    const contract = getContract({
        address: contractAddress,
        abi: spacesAbi,
        client: { public: publicClient }
    })

    const uri = await contract.read.tokenURI([BigInt(tokenId)])
    console.log(uri)
    return fromIpns(uri)
}

export async function fromIpns(ipnsRecord: string): Promise<any> {
    const name = Name.parse(ipnsRecord)
    let cid = (await Name.resolve(name)).value

    if (cid.startsWith('/ipfs/')) {
        cid = cid.substring(6)
    }

    const url = `https://${cid}.ipfs.w3s.link`

    return fetch(url)
        .then(res => res.json())
}