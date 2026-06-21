import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Home, AlertCircle } from 'lucide-react'

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <AlertCircle className="mx-auto h-20 w-20 text-gray-400 mb-4" />
                <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                <Button onClick={() => navigate('/')} className="gap-2">
                    <Home size={18} />
                    Go Home
                </Button>
            </div>
        </div>
    )
}

export default NotFound