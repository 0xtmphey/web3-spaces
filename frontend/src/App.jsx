import { useState } from 'react'
import './App.css'
import { Home } from './Home'
import { Web3Provider } from './Web3Provider'
import { Header } from './Header'
import Spaces from './Space'

function App() {

  return (
    <Web3Provider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Header />
        <Spaces editable />
      </div>

    </Web3Provider>
  )
}

export default App
