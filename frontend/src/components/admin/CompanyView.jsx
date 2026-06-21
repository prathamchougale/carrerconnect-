import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Building2, MapPin, Globe, Calendar, Briefcase } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const CompanyView = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const [companyRes, jobsRes] = await Promise.all([
                    axios.get(`${COMPANY_API_END_POINT}/get/${params.id}`, { withCredentials: true }),
                    axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true })
                ]);

                if (companyRes.data.success) {
                    setCompany(companyRes.data.company);
                }
                if (jobsRes.data.success) {
                    const companyJobs = jobsRes.data.jobs.filter(job => job.company?._id === params.id);
                    setJobs(companyJobs);
                }
            } catch (error) {
                toast.error("Failed to fetch company details");
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#7209b7] border-t-transparent rounded-full"></div>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-4xl mx-auto my-10 text-center">
                    <h1 className="text-2xl font-bold">Company not found</h1>
                    <Button onClick={() => navigate('/admin/companies')} className="mt-4">Back to Companies</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto my-10">
                <Button onClick={() => navigate('/admin/companies')} variant="outline" className="mb-6 flex items-center gap-2">
                    <ArrowLeft size={18} />
                    Back to Companies
                </Button>

                <div className="bg-white rounded-xl shadow-sm border p-8">
                    <div className="flex items-start gap-6">
                        <img 
                            src={company.logo || '/default-company.png'} 
                            alt={company.name}
                            className="w-24 h-24 rounded-lg object-cover border"
                            onError={(e) => {e.target.src = '/default-company.png'}}
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                            
                            <div className="flex flex-wrap gap-4 mt-4 text-gray-600">
                                {company.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        <span>{company.location}</span>
                                    </div>
                                )}
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#7209b7] hover:underline">
                                        <Globe size={16} />
                                        <span>Website</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    <span>Registered: {company.createdAt?.split("T")[0]}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {company.description && (
                        <div className="mt-6">
                            <h2 className="font-bold text-lg mb-2">About</h2>
                            <p className="text-gray-600">{company.description}</p>
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Briefcase size={20} />
                            Posted Jobs ({jobs.length})
                        </h2>
                        
                        {jobs.length === 0 ? (
                            <p className="text-gray-400">No jobs posted yet</p>
                        ) : (
                            <div className="space-y-3">
                                {jobs.map(job => (
                                    <div key={job._id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg">{job.title}</h3>
                                                <p className="text-gray-500 text-sm">{job.location} • {job.jobType} • {job.salary}LPA</p>
                                            </div>
                                            <span className="text-sm text-gray-400">{job.applications?.length || 0} applicants</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyView