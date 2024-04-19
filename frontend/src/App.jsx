import React from 'react'
import './App.css'
import { Web3Provider } from './Web3Provider'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Home } from './Home'
import { Space } from './Space';
import { ConnectKitButton } from 'connectkit'

function App() {

  console.log('App render')

  return (
    <Web3Provider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/token/:id' element={<Space editable={true} />} />
          <Route path='*' element={<div>Not found</div>} />
        </Route>
      </Routes>
    </Web3Provider>
  )
}

function Layout() {
  return (
    <div className='app'>
      <div className='header'>
        <Link to='/'>Web3 Spaces</Link>
        <div className='spacer' />
        <ConnectKitButton />
      </div>
      <Outlet />
    </div>
  );
}

export default App
