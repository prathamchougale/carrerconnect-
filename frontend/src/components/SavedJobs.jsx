import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import axios from 'axios'
import { SAVED_JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await axios.get(`${SAVED_JOB_API_END_POINT}/get`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setSavedJobs(res.data.savedJobs);
                }
            } catch (error) {
                toast.error("Failed to load saved jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchSavedJobs();
    }, []);

    // Extract actual job data from saved job object, skip if job was deleted
    const validJobs = savedJobs
        .filter((savedJob) => savedJob !== null && savedJob !== undefined) // remove null elements
        .map((savedJob) => savedJob.job)  // <-- FIXED: use .job not .jobId
        .filter((job) => job !== null && job !== undefined); // remove null jobs

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                <h1 className='font-bold text-2xl mb-6'>Saved Jobs</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : validJobs.length === 0 ? (
                    <p className='text-gray-500'>No saved jobs yet</p>
                ) : (
                    <div className='grid grid-cols-3 gap-4'>
                        {validJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SavedJobs