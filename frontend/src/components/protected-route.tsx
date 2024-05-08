import { useAuth, } from '@clerk/clerk-react'
import React from 'react'
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children}:{children: React.ReactNode}) {
    const { isSignedIn } = useAuth();
    if(!isSignedIn) {
        return <Navigate to="/"/>
    }
    return <>{children}</> 
}
