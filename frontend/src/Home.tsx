import React, { useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { ConnectPublicClient, ConnectWalletClient } from './onchain/client'
import { spacesAbi, contractAddress } from './onchain/spacesApi'
import { getContract } from 'viem'
import { prepareMint } from './api'
import Loader from './components/Loader'
import { Link } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

export function Home() {

    const { address, status } = useAccount()

    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    }}>
        <div className='header'>
            <Link to='/'>Web3 Spaces</Link>
            <div className='spacer' />
            <ConnectKitButton />
        </div>
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

    useEffect(() => {
        const publicClient = ConnectPublicClient()
        console.log('Trying to watch contract events...')
        return publicClient.watchContractEvent({
            address: contractAddress,
            abi: spacesAbi,
            eventName: 'Transfer',
            onLogs: (logs: any) => {
                console.log(logs)
                setMinting(false)
                window.location.href = `/token/${logs[0].args.tokenId}`
            },
            onError: (error: any) => {
                console.log(error)
                setMinting(false)
                alert(error.message)
            },
        })
    }, [])

    const handleClick = async () => {
        setMinting(true)
        try {
            const walletClient = ConnectWalletClient()
            const publicClient = ConnectPublicClient()

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
        {minting ? <CircularProgress /> : 'Mint'}
    </button>
}

const MSG_TO_SIGN = 'Please sign this message to mint a new Space'