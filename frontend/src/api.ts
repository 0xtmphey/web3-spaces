const BASE_URL: string = import.meta.env["VITE_BACKEND_HOST"]!

interface PrepareMintParams {
    message: string,
    signature: string,
    address: string
}

/**
 * Prepares a NFT mint by generating a unique NFT URI and uploading it to IPFS.
 *
 * @param params - The parameters required to prepare the mint.
 * @param params.message - The message to be signed.
 * @param params.signature - The signature of the message.
 * @param params.address - The Ethereum address of the recipient.
 * @returns The NFT URI.
 */
export async function prepareMint(
    params: PrepareMintParams
): Promise<string> {
    const { message, signature, address } = params
    const url = `${BASE_URL}/prepare`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message,
            signature,
            address
        })
    })
    return await response.json()
}

export async function updateSpaceData(signData: any, spaceData: any, tokenId: string): Promise<void> {
    const url = `${BASE_URL}/update/${tokenId}`
    const body = {
        signature: signData,
        spaceData
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
}
