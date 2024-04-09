import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, arbitrum } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { defineChain } from "viem";

const stylusTestnet = defineChain({
    id: 23011913,
    name: 'Stylus testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://stylus-testnet.arbitrum.io/rpc'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Arbiscan',
            url: 'https://stylus-testnet-explorer.arbitrum.io/',
            apiUrl: 'https://stylus-testnet-explorer.arbitrum.io/api',
        },
    },
    testnet: true,
})

const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [mainnet, stylusTestnet],

        // Required API Keys
        walletConnectProjectId: process.env["WALLET_CONNECT_PROJECT_ID"]!,

        // Required App Info
        appName: "Web3 Spaces",

        // Optional App Info
        appDescription: "Your personal corner of the Web",
        appUrl: "https://family.co", // your app's url
        appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};