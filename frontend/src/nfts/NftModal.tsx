import React, { useCallback, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Alchemy, Network } from "alchemy-sdk"
import { Gallery } from "react-grid-gallery"

const config = {
    apiKey: import.meta.env["VITE_ALCHEMY_API_KEY"]!,
    network: Network.BASE_MAINNET
}

const alchemy = new Alchemy(config)

export function NftModal({ onImageClick }) {
    const { address } = useAccount()
    const [images, setImages] = useState<any[]>([])

    useEffect(() => {
        if (!address) return
        console.log('Loading NFTs')
        alchemy.nft.getNftsForOwner(address)
            .then(result => {
                let newImages: any[] = []
                result.ownedNfts.forEach(nft => {
                    newImages.push({
                        src: nft.image.cachedUrl,
                        tags: [{ value: nft.name, title: nft.name }],
                        nft: nft,
                    })
                })
                setImages(newImages)
            })
            .catch(e => {
                console.error('Failed to fetch nfts', e)
            })

    }, [address])

    return <div className="tool-modal-extra">
        <Gallery images={images} onClick={(idx, item, event) => { onImageClick(item.nft) }} />
    </div>
}