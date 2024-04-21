import { OwnedNft } from "alchemy-sdk"
import { AssetRecordType, Editor } from "tldraw"

export function postNft(nft: OwnedNft, editor: Editor | null) {
    if (!editor) return
    const img = nft.image

    if (!img.cachedUrl) {
        console.log(`No cachedUrl for ${nft}`)
        return
    }

    return postImage(img.cachedUrl, nft.tokenId, editor)
}

export async function postImage(url: string, name: string, editor: Editor | null) {
    if (!editor) return
    const assetId = AssetRecordType.createId(url)

    getMeta(url)
        .then(img => {
            const imageWidth = img.naturalWidth / 4
            const imageHeight = img.naturalHeight / 4

            editor.createAssets([
                {
                    id: assetId,
                    type: 'image',
                    typeName: 'asset',
                    props: {
                        name: name,
                        src: url,
                        w: imageWidth,
                        h: imageHeight,
                        mimeType: "image/*",
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
