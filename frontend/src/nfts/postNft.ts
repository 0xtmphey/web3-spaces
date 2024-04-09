import { OwnedNft } from "alchemy-sdk"
import { AssetRecordType, Editor } from "tldraw"

export function postNft(nft: OwnedNft, editor: Editor | null) {
    if (!editor) return
    const assetId = AssetRecordType.createId()
    const img = nft.image

    if (!img.cachedUrl) {
        console.log(`No cachedUrl for ${nft}`)
        return
    }

    getMeta(img.cachedUrl)
        .then(img => {
            const imageWidth = img.naturalWidth / 4
            const imageHeight = img.naturalHeight / 4

            editor.createAssets([
                {
                    id: assetId,
                    type: 'image',
                    typeName: 'asset',
                    props: {
                        name: nft.tokenId,
                        src: nft.image.cachedUrl!,
                        w: imageWidth,
                        h: imageHeight,
                        mimeType: nft.image.contentType || "image/*",
                        isAnimated: true,
                    },
                    meta: {},
                },
            ])

            editor.createShape({
                type: 'image',
                x: (window.innerWidth - imageWidth) / 2,
                y: (window.innerHeight - imageHeight) / 2,
                props: {
                    assetId,
                    w: imageWidth,
                    h: imageHeight,
                },
            })
        })
}

const getMeta = async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img
};
