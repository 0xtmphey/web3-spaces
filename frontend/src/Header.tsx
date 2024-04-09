import React from "react"
import { ConnectKitButton } from "connectkit"

export function Header() {
    return <header>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
        }}>
            <div style={{ flex: 1 }}></div>
            <ConnectKitButton />
        </div>
    </header>
}