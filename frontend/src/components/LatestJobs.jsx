import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LatestJobCards from './LatestJobCards'
import { ArrowRight } from 'lucide-react'

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job)
    const navigate = useNavigate()

    return (
        <div className='max-w-7xl mx-auto my-20 px-4'>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className='text-4xl font-bold'>
                        <span className='text-[#6A38C2]'>Latest & Top</span> Job Openings
                    </h1>
                    <p className="text-gray-500 mt-2">Discover your next career opportunity</p>
                </div>
                <button 
                    onClick={() => navigate('/jobs')}
                    className="flex items-center gap-2 text-[#552CA0] font-medium hover:text-[#6A38C2] transition-colors"
                >
                    View All Jobs
                    <ArrowRight size={18} />
                </button>

 
            </div>

            {/* Jobs Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                    allJobs.length <= 0 ? (
                        <div className="col-span-3 text-center py-16">
                            <p className="text-gray-400 text-lg">No jobs available at the moment</p>
                            <button 
                                onClick={() => navigate('/jobs')}
                                className="mt-4 text-emerald-600 hover:underline"
                            >
                                Browse all jobs
                            </button>
                        </div>
                    ) : (
                        allJobs?.slice(0, 6).map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default LatestJobs