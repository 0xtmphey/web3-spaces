import { createWalletClient, createPublicClient, custom, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import "viem/window";

export function ConnectWalletClient() {
    // Check for window.ethereum
    let transport;
    if (window.ethereum) {
        transport = custom(window.ethereum);
    } else {
        const errorMessage = "MetaMask or another web3 wallet is not installed. Please install one to proceed.";
        throw new Error(errorMessage);
    }

    // Delcalre a Wallet Client
    const walletClient = createWalletClient({
        chain: arbitrumSepolia,
        transport: transport,
    });

    return walletClient;
}

export function ConnectPublicClient() {
    const publicClient = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
    });

    return publicClient;
}