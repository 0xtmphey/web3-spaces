import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TLComponents, TLStoreWithStatus, TLUiOverrides, Tldraw, createTLStore, defaultShapeUtils, toolbarItem, useEditor } from "tldraw"
import 'tldraw/tldraw.css'
import { getRemoteSnapshot } from "./getRemoteSnapshot"

interface SpaceProps {
    editable: boolean
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

    const { id } = useParams()

    useEffect(() => {
        let cancelled = false
        async function loadSnapshot() {
            const snapshot = await getRemoteSnapshot(id!)
            console.log('loaded snapshot', snapshot)
            if (cancelled) return

            const newStore = createTLStore({
                shapeUtils: defaultShapeUtils
            })

            // newStore.loadSnapshot(snapshot)

            console.log(JSON.stringify(newStore.getSnapshot()))

            setStoreWithStatus({
                store: newStore,
                status: 'synced-remote',
                connectionStatus: 'online'
            })
        }

        loadSnapshot()

        return () => {
            cancelled = false
        }
    }, [])

    return (
        <div style={{ width: '100%', flex: 1, overflow: 'hidden' }}>
            <Tldraw
                store={storeWithStatus}
                assetUrls={{
                    icons: {
                        'tool-gif': '/tool.gif.svg',
                        'tool-nft': '/tool.nft.svg',
                    }
                }}
                overrides={overrides}
                components={props.editable ? componentsEdit : componentsView}
                onMount={(editor) => {
                    editor.updateInstanceState({ isReadonly: !props.editable })
                }}
            />
        </div>
    )
}

export const Space = React.memo(Spaces)