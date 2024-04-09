import { AssetRecordType, Editor } from "tldraw";
import { IGif } from "@giphy/js-types"

export function postGif(gif: IGif, editor: Editor | null) {
    if (!editor) return
    const assetId = AssetRecordType.createId()
    const img = gif.images.preview_webp
    const imageWidth = img.width
    const imageHeight = img.height

    editor.createAssets([
        {
            id: assetId,
            type: 'image',
            typeName: 'asset',
            props: {
                name: gif.id.toString(),
                src: img.url,
                w: imageWidth,
                h: imageHeight,
                mimeType: 'image/webp',
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
}