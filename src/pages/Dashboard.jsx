import React from 'react'
import { Outlet } from 'react-router-dom'
import SlideBar from '../components/SlideBar'

function Dashboard() {
    return (
        <div className='grid grid-cols-12'>
            <div className='col-span-2'>
                <SlideBar/>
            </div>
            <div className='col-span-10'>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard