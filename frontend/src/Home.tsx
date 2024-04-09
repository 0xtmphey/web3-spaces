import React from 'react'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'

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
                        return <div>connected</div>
                    case 'reconnecting':
                        return <div>reconnecting</div>
                    case 'connecting':
                        return <div>connecting...</div>
                }
            })()}
        </div>

    </div>
}