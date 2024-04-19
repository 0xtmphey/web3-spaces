import {
    Grid, // our UI Component to display the results
    SearchBar, // the search bar the user will type into
    SearchContext, // the context that wraps and connects our components
    SearchContextManager, // the context manager, includes the Context.Provider
    SuggestionBar, // an optional UI component that displays trending searches and channel / username results
} from '@giphy/react-components'
import React, { useContext } from 'react'


// define the components in a separate function so we can
// use the context hook. You could also use the render props pattern
const Components = ({ width, onGifClick }) => {
    const { fetchGifs, searchKey } = useContext(SearchContext)
    return (
        <>
            <SearchBar />
            <SuggestionBar />
            <Grid
                key={searchKey}
                columns={3}
                width={width}
                fetchGifs={fetchGifs}
                onGifClick={onGifClick}
            />
        </>
    )
}

export function GiphyModal({ onGifClick }) {
    return <div className='tool-modal-extra'>
        <SearchContextManager apiKey={import.meta.env["VITE_GIPHY_API_KEY"]!}>
            <Components width={640} onGifClick={onGifClick} />
        </SearchContextManager>
    </div>;
}