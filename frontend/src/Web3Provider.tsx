import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, arbitrum, arbitrumSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";


const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [arbitrumSepolia],

        // Required API Keys
        walletConnectProjectId: import.meta.env["VITE_WALLET_CONNECT_PROJECT_ID"]!,

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