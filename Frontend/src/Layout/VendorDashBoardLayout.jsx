import React, { useEffect } from 'react'
import VendorSidebar from '../components/VendorSideBar'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../Store/authStore'

export default function VendorDashBoardLayout(isOpen) {

    const { user } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (user.role === 'customer') {
            navigate('/dashboard/profile')
        }
    }, [user])

    return (
        <div>
            {user.role !== 'customer' && 
                <VendorSidebar></VendorSidebar>
            }
            <main>
                <Outlet />
            </main>
        </div >
    )
}
