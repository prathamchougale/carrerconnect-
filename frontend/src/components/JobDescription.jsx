import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar'
import { ArrowLeft, Upload, FileText, X } from 'lucide-react';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    
    const checkIfApplied = (job, userId) => {
        if (!job?.applications || !userId) return false;
        return job.applications.some(application => {
            const applicantId = application.applicant?._id || application.applicant;
            return applicantId?.toString() === userId?.toString();
        });
    };
    
    const isInitiallyApplied = checkIfApplied(singleJob, user?._id);
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const [showResumeDialog, setShowResumeDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const getDaysRemaining = (deadline) => {
        if (!deadline) return null;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = getDaysRemaining(singleJob?.deadline);

    const applyJobHandler = async () => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`, 
                {}, 
                { withCredentials: true }
            );
            
            if(res.data.success){
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob, 
                    applications: [...(singleJob?.applications || []), {applicant: user?._id}]
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            // If resume is required, show upload dialog
            if (error.response?.data?.requiresResume) {
                setShowResumeDialog(true);
                toast.error("Please upload your resume first");
            } else {
                toast.error(error.response?.data?.message || "Failed to apply");
            }
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            toast.error("Please select a PDF file");
        }
    }

    const uploadResumeAndApply = async () => {
        if (!selectedFile) {
            toast.error("Please select a resume file");
            return;
        }

        try {
            setUploading(true);
            
            // Step 1: Upload resume to profile
            const formData = new FormData();
            formData.append("fullname", user?.fullname || "");
            formData.append("email", user?.email || "");
            formData.append("phoneNumber", user?.phoneNumber || "");
            formData.append("bio", user?.profile?.bio || "");
            formData.append("skills", user?.profile?.skills?.join(",") || "");
            formData.append("file", selectedFile);

            const updateRes = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                withCredentials: true
            });

            if (!updateRes.data.success) {
                toast.error("Failed to upload resume");
                return;
            }

            // Step 2: Now apply for the job
            const applyRes = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`, 
                {}, 
                { withCredentials: true }
            );

            if (applyRes.data.success) {
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob, 
                    applications: [...(singleJob?.applications || []), {applicant: user?._id}]
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success("Resume uploaded and job applied successfully!");
                setShowResumeDialog(false);
                setSelectedFile(null);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setUploading(false);
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    const hasApplied = checkIfApplied(res.data.job, user?._id);
                    setIsApplied(hasApplied);
                }
            } catch (error) {
                console.log(error);
            }
        }
        if(jobId) fetchSingleJob(); 
    }, [jobId, dispatch, user?._id]);

    useEffect(() => {
        const hasApplied = checkIfApplied(singleJob, user?._id);
        setIsApplied(hasApplied);
    }, [singleJob, user?._id]);

    return (
        <div>
            <Navbar />
            
            <div className='max-w-7xl mx-auto my-10'>
                <Button 
                    variant="outline" 
                    onClick={() => navigate('/jobs')}
                    className="mb-6 flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back to Jobs
                </Button>

                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                        <div className='flex items-center gap-2 mt-4'>
                            <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.position} Positions</Badge>
                            <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                            <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                        </div>
                    </div>
                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`rounded-lg ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7209b7]'}`}
                    >
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
                
                <div className='my-4'>
                    <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                    <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                    <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                    <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
                    <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                    
                    {singleJob?.deadline && (
                        <h1 className='font-bold my-1 flex items-center gap-2'>
                            Application Deadline: 
                            <span className='pl-2 font-normal text-gray-800'>
                                {new Date(singleJob.deadline).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            {daysRemaining !== null && (
                                <span className={`ml-2 px-2 py-0.5 rounded text-sm font-medium ${
                                    daysRemaining > 7 ? 'bg-green-100 text-green-700' : 
                                    daysRemaining > 0 ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {daysRemaining > 0 ? `${daysRemaining} days left` : 
                                     daysRemaining === 0 ? 'Last day!' : 'Expired'}
                                </span>
                            )}
                        </h1>
                    )}
                    
                    <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length || 0}</span></h1>
                    <h1 className='font-bold my-1'>
                        Posted Date: <span className='pl-4 font-normal text-gray-800'>
                            {singleJob?.createdAt?.split("T")[0]}
                        </span>
                    </h1>
                </div>
            </div>

            {/* RESUME UPLOAD DIALOG */}
            {showResumeDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Upload Resume to Apply</h2>
                            <button 
                                onClick={() => setShowResumeDialog(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            Please upload your resume before applying for this job. Only PDF files are accepted.
                        </p>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="resume-upload"
                            />
                            <label 
                                htmlFor="resume-upload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <FileText size={48} className="text-gray-400 mb-2" />
                                {selectedFile ? (
                                    <span className="text-green-600 font-medium">{selectedFile.name}</span>
                                ) : (
                                    <>
                                        <span className="text-blue-600 font-medium">Click to upload PDF</span>
                                        <span className="text-gray-400 text-sm mt-1">Max file size: 5MB</span>
                                    </>
                                )}
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => setShowResumeDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-[#7209b7]"
                                onClick={uploadResumeAndApply}
                                disabled={uploading || !selectedFile}
                            >
                                {uploading ? 'Uploading...' : 'Upload & Apply'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JobDescription