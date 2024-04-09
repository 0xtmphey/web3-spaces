import React, { useEffect, useState } from "react"
import { AssetRecordType, Editor, TLComponents, TLUiOverrides, Tldraw, toolbarItem, useEditor } from "tldraw"
import 'tldraw/tldraw.css'
import { GiphyModal } from "./gifs/GiphyModal";
import { IGif } from '@giphy/js-types'
import { postGif } from "./gifs/postGif";
import { NftModal } from "./nfts/NftModal";
import { postNft } from "./nfts/postNft";

interface SpaceProps {
    editable: boolean
}

export default function Spaces(props: SpaceProps) {
    const [showGifModal, setShowGifModal] = useState(false)
    const [showNftModal, setShowNftModal] = useState(false)
    const [editor, setEditor] = useState<Editor | null>(null)

    return (
        <div style={{ width: '100%', flex: 1 }}>
            <Tldraw
                persistenceKey="local-dev"
                assetUrls={{
                    icons: {
                        'tool-gif': '/tool.gif.svg',
                        'tool-nft': '/tool.nft.svg',
                    }
                }}
                components={getComponents(props.editable)}
                onMount={(editor) => {
                    setEditor(editor)
                    editor.updateInstanceState({ isReadonly: !props.editable })
                    // removeDefaultBackground()
                }}
                overrides={myOverrides(
                    () => { setShowGifModal(!showGifModal) },
                    () => { setShowNftModal(!showNftModal) }
                )}
            >
                {showGifModal && <GiphyModal onGifClick={(g: IGif, e: any) => {
                    e.preventDefault()
                    e.stopPropagation()
                    postGif(g, editor)

                    setShowGifModal(false)
                }} />}

                {showNftModal && <NftModal onImageClick={nft => {
                    postNft(nft, editor)
                    setShowNftModal(false)
                }} />}
            </Tldraw>
        </div>

    )
}

const myOverrides = (onShowGif, onShowNft): TLUiOverrides => {
    return {
        tools(editor, tools) {
            tools.gif = {
                id: 'gif',
                icon: 'tool-gif',
                label: 'Giphy',
                onSelect: () => {
                    onShowGif(true)
                },
            }
            tools.nft = {
                id: 'nft',
                icon: 'tool-nft',
                label: 'Nfts',
                onSelect: () => {
                    onShowNft(true)
                },
            }
            return tools
        },
        toolbar(_app, toolbar, { tools }) {
            console.log(toolbar)
            toolbar.splice(4, 0, toolbarItem(tools.gif))
            toolbar.splice(5, 0, toolbarItem(tools.nft))
            return toolbar
        },
    }
}

function getComponents(editable: boolean): TLComponents {
    const base: TLComponents = {
        MenuPanel: null,
        DebugMenu: null,
        HelpMenu: null,
    }
    if (!editable) {
        base.Toolbar = null
        base.StylePanel = null
    }
    return base
}

function removeDefaultBackground() {
    const back = document.getElementsByClassName("tl-background")
    if (back.length < 1) {
        return
    }

    back[0].setAttribute('style', 'background-color: unset')
}