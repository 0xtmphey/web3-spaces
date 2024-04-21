import React, { useCallback, useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { Editor, TLComponents, TLStoreWithStatus, TLUiOverrides, Tldraw, createTLStore, defaultShapeUtils, toolbarItem, useEditor } from "tldraw"
import 'tldraw/tldraw.css'
import { getRemoteSnapshot } from "./getRemoteSnapshot"
import { ConnectKitButton } from "connectkit"
import { ConnectWalletClient, ConnectPublicClient } from "./onchain/client"
import { useAccount } from "wagmi"
import { updateSpaceData } from "./api"
import { GiphyModal } from "./gifs/GiphyModal"
import { NftModal } from "./nfts/NftModal"
import { getContract } from "viem"
import { contractAddress, spacesAbi } from "./onchain/spacesApi"
import { postImage } from "./nfts/postNft"

interface SpaceProps {
    editable: boolean
}

enum ViewMode {
    VIEW = 'VIEW',
    EDIT = 'EDIT',
}

const componentsEdit: TLComponents = {
    MenuPanel: null,
    DebugMenu: null,
    HelpMenu: null,
}
const componentsView: TLComponents = {
    MenuPanel: null,
    DebugMenu: null,
    HelpMenu: null,
    Toolbar: null,
    StylePanel: null
}
const overrides: TLUiOverrides = {
    tools(editor, tools) {
        tools.gif = {
            id: 'gif',
            icon: 'tool-gif',
            label: 'Giphy',
            onSelect: () => {
            },
        }
        tools.nft = {
            id: 'nft',
            icon: 'tool-nft',
            label: 'Nfts',
            onSelect: () => {

            },
        }
        return tools
    },
    toolbar(_app, toolbar, { tools }) {
        toolbar.splice(4, 0, toolbarItem(tools.gif))
        toolbar.splice(5, 0, toolbarItem(tools.nft))
        return toolbar
    },
}

function Spaces(props: SpaceProps) {
    console.log("Spaces render")

    const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
        status: 'loading'
    })
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.VIEW)
    const [editor, setEditor] = useState<Editor>()
    const [showGM, setShowGM] = useState(false)
    const [showNM, setShowNM] = useState(false)

    const { id: tokenId } = useParams()
    const { address } = useAccount()
    const editable = (viewMode === ViewMode.EDIT)

    useEffect(() => {
        console.log("Updating editor: canEdit: ", editable)
        editor?.updateInstanceState({ isReadonly: viewMode !== ViewMode.EDIT })
    }, [viewMode, editor])

    useEffect(() => {
        let cancelled = false
        async function loadSnapshot() {
            const snapshot = await getRemoteSnapshot(tokenId!)
            console.log('loaded snapshot', snapshot)
            if (cancelled) return

            const newStore = createTLStore({
                shapeUtils: defaultShapeUtils
            })

            newStore.loadSnapshot(snapshot)

            setStoreWithStatus({
                store: newStore,
                status: 'synced-remote',
                connectionStatus: 'online'
            })
        }

        loadSnapshot()

        return () => {
            cancelled = true
        }
    }, [])

    const setEditMode = () => {
        setViewMode(ViewMode.EDIT)
    }

    const save = async () => {
        const walletClient = ConnectWalletClient()

        try {
            const signature = await walletClient.signMessage({
                message: MSG_TO_SIGN,
                account: address!,
            })

            const snapshot = storeWithStatus.store?.getSnapshot()
            if (!snapshot) throw new Error('Failed to get snapshot')

            await updateSpaceData(
                {
                    signature,
                    message: MSG_TO_SIGN,
                    address: address!
                },
                snapshot,
                tokenId!
            )

            setViewMode(ViewMode.VIEW)
        } catch (e) {
            console.log(e)
        }
    }

    const overrides = useCallback((): TLUiOverrides => {
        return {
            tools(editor, tools) {
                tools.gif = {
                    id: 'gif',
                    icon: 'tool-gif',
                    label: 'Giphy',
                    onSelect: () => {
                        setShowGM(!showGM)
                    },
                }
                tools.nft = {
                    id: 'nft',
                    icon: 'tool-nft',
                    label: 'Nfts',
                    onSelect: () => {
                        setShowNM(!showNM)
                    },
                }
                return tools
            },
            toolbar(_app, toolbar, { tools }) {
                toolbar.splice(4, 0, toolbarItem(tools.gif))
                toolbar.splice(5, 0, toolbarItem(tools.nft))
                return toolbar
            },
        }
    }, [showGM, showNM])

    const handleMount = useCallback((editor: Editor) => {
        setEditor(editor)

        editor.registerExternalContentHandler('url', ({ url }) => {
            if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.includes('imgur.com')) {
                postImage(url, url, editor).catch(console.log)
            }
        })
    }, [])

    return (
        <div style={{ width: '100%', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className='header'>
                <Link to='/'>Web3 Spaces</Link>
                <div className='spacer' />
                {(viewMode === ViewMode.VIEW) && <button onClick={() => setEditMode()}>Edit</button>}
                {viewMode === ViewMode.EDIT && <button onClick={() => save()}>Save</button>}
                <div style={{ width: '20px' }}></div>
                <ConnectKitButton />
            </div>
            <Tldraw
                store={storeWithStatus}
                assetUrls={{
                    icons: {
                        'tool-gif': '/tool.gif.svg',
                        'tool-nft': '/tool.nft.svg',
                    }
                }}
                overrides={overrides()}
                components={editable ? componentsEdit : componentsView}
                onMount={handleMount}
            >
                {showGM && <GiphyModal closeSelf={() => setShowGM(false)} />}
                {showNM && <NftModal closeSelf={() => setShowNM(false)} />}
            </Tldraw>
        </div>
    )
}

const MSG_TO_SIGN = 'Please sign this message to save your changes'

export const Space = React.memo(Spaces)