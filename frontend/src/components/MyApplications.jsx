import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
    Briefcase, 
    MapPin, 
    DollarSign, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Loader2,
    ArrowLeft,
    Building2
} from 'lucide-react'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const MyApplications = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchAppliedJobs()
        
        // Auto-refresh every 10 seconds to catch status updates
        const interval = setInterval(() => {
            fetchAppliedJobs(false)
        }, 10000)
        
        return () => clearInterval(interval)
    }, [])

    const fetchAppliedJobs = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true)
            
            const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                withCredentials: true
            })

            if (res.data.success) {
                setApplications(res.data.applications || [])
            } else {
                setApplications([])
            }
        } catch (error) {
            console.log("Fetch error:", error)
            if (showLoading) toast.error("Failed to load applications")
            setApplications([])
        } finally {
            if (showLoading) setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        // Map backend status to display status
        const statusMap = {
            'pending': 'Applied',
            'applied': 'Applied',
            'accepted': 'Accepted',
            'rejected': 'Rejected'
        }

        const displayStatus = statusMap[(status || '').toLowerCase()] || 'Applied'

        const styles = {
            'Applied': "bg-yellow-100 text-yellow-700 border-yellow-300",
            'Accepted': "bg-green-100 text-green-700 border-green-300",
            'Rejected': "bg-red-100 text-red-700 border-red-300"
        }

        const icons = {
            'Applied': <Clock size={14} className="mr-1" />,
            'Accepted': <CheckCircle size={14} className="mr-1" />,
            'Rejected': <XCircle size={14} className="mr-1" />
        }

        return (
            <Badge className={`${styles[displayStatus]} capitalize`}>
                {icons[displayStatus]}
                {displayStatus}
            </Badge>
            )
    }

     const formatDate = (date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getJob = (app) => app?.job || {}
    const getCompany = (app) => app?.job?.company || {}

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                        <p className="text-gray-500 mt-1">
                            {applications?.length || 0} job{applications?.length !== 1 ? 's' : ''} applied
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/jobs')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Browse More Jobs
                    </Button>
                </div>

                {(!applications || applications.length === 0) ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
                        <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Yet</h3>
                        <p className="text-gray-400 mb-6">Start applying to jobs and track your applications here</p>
                        <Button 
                            onClick={() => navigate('/jobs')}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            Browse Jobs
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app, index) => (
                            <div 
                                key={app?._id || index}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <img 
                                            src={getCompany(app).logo || '/default-company.png'} 
                                            alt={getCompany(app).name || 'Company'}
                                            className="w-14 h-14 rounded-lg object-cover border"
                                            onError={(e) => {e.target.src = '/default-company.png'}}
                                        />
                                        
                                        <div>
                                            <h3 
                                                className="text-lg font-bold text-gray-900 hover:text-emerald-600 cursor-pointer"
                                                onClick={() => navigate(`/description/${getJob(app)._id}`)}
                                            >
                                                {getJob(app).title || 'Untitled Job'}
                                            </h3>
                                            
                                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                <Building2 size={14} />
                                                <span>{getCompany(app).name || 'Unknown Company'}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mt-3">
                                                {getJob(app).location && (
                                                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                                                        <MapPin size={12} className="mr-1" />
                                                        {getJob(app).location}
                                                    </Badge>
                                                )}
                                                {getJob(app).salary && (
                                                    <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                                                        <DollarSign size={12} className="mr-1" />
                                                        {getJob(app).salary} LPA
                                                    </Badge>
                                                )}
                                                {getJob(app).jobType && (
                                                    <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">
                                                        <Briefcase size={12} className="mr-1" />
                                                        {getJob(app).jobType}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        {getStatusBadge(app?.status)}
                                        <p className="text-sm text-gray-400 mt-2 flex items-center justify-end gap-1">
                                            <Calendar size={14} />
                                            Applied {formatDate(app?.appliedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t mt-4 pt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Application ID: <span className="font-mono text-gray-700">{app?._id?.slice(-8) || 'N/A'}</span>
                                    </p>
                                    
                                    {getJob(app)._id && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => navigate(`/description/${getJob(app)._id}`)}
                                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                        >
                                            View Job Details →
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyApplications