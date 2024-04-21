import React, { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Editor, TLComponents, TLStoreWithStatus, TLUiOverrides, Tldraw, createTLStore, defaultShapeUtils, toolbarItem, useEditor } from "tldraw"
import 'tldraw/tldraw.css'
import { getRemoteSnapshot } from "./getRemoteSnapshot"
import { ConnectKitButton } from "connectkit"

interface SpaceProps {
    editable: boolean
}

enum ViewMode {
    VIEW_AS_OWNER = 'VIEW_AS_OWNER',
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
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.VIEW_AS_OWNER)
    const [editor, setEditor] = useState<Editor>()

    const { id } = useParams()
    const editable = (viewMode === ViewMode.EDIT)

    useEffect(() => {
        editor?.updateInstanceState({ isReadonly: !editable })
    }, [editable])

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

    const setEditMode = () => {
        setViewMode(ViewMode.EDIT)
    }
    return (
        <div style={{ width: '100%', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className='header'>
                <Link to='/'>Web3 Spaces</Link>
                <div className='spacer' />
                {viewMode === ViewMode.VIEW_AS_OWNER && <button onClick={() => setEditMode()}>Edit</button>}
                {viewMode === ViewMode.EDIT && <button onClick={() => setViewMode(ViewMode.VIEW_AS_OWNER)}>Save</button>}
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
                overrides={overrides}
                components={editable ? componentsEdit : componentsView}
                onMount={(editor) => {
                    setEditor(editor)
                    editor.updateInstanceState({ isReadonly: !editable })
                }}
            />
        </div>
    )
}

export const Space = React.memo(Spaces)