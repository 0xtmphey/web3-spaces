import React, { useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { ConnectPublicClient, ConnectWalletClient } from './onchain/client'
import { spacesAbi, contractAddress } from './onchain/spacesApi'
import { getContract } from 'viem'
import { prepareMint } from './api'
import Loader from './components/Loader'

export function Home() {

    const { address, status } = useAccount()

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    }}>
        <h1>Welcome to Web3 Spaces</h1>
        <h3>Your personal corner of the Internet</h3>
        <div style={{ height: '40px' }}></div>

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {(() => {
                switch (status) {
                    case 'disconnected':
                        return <>
                            <p>Connect wallet to view your Spaces or mint a new one.</p>
                            <ConnectKitButton />
                        </>
                    case 'connected':
                        return <div><MintButton /></div>
                    case 'reconnecting':
                        return <div>reconnecting</div>
                    case 'connecting':
                        return <div>connecting...</div>
                }
            })()}
        </div>

    </div>
}

function MintButton() {

    const { address } = useAccount()
    const [minting, setMinting] = useState(false)

    const handleClick = async () => {
        setMinting(true)
        const walletClient = ConnectWalletClient()
        const publicClient = ConnectPublicClient()

        try {
            const signature = await walletClient.signMessage({
                message: MSG_TO_SIGN,
                account: address!,
            })

            const { ipns }: any = await prepareMint({
                message: MSG_TO_SIGN,
                signature,
                address: address!,
            })

            const contract = getContract({
                address: contractAddress,
                abi: spacesAbi,
                client: { public: publicClient, wallet: walletClient }
            })

            const result = await contract.write.safeMint([ipns], { account: address! })
            console.log(result)
        } catch (e) {
            console.log(e)
            setMinting(false)
            alert('Mint failed')
        }
    }

    return <button onClick={handleClick}>
        {minting ? <Loader /> : 'Mint'}
    </button>
}

const MSG_TO_SIGN = 'Please sign this message to mint a new Space'