import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './pages/components/Navbar'

export default function UserLayout() {
  return (
    <div className="max-w-7xl mx-auto">
        <Navbar />
        
        <Outlet/>
    </div>
  )
}
