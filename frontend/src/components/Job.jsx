import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SAVED_JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const Job = ({job}) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    // Check if job is saved on mount
    useEffect(() => {
        const checkSaved = async () => {
            try {
                const res = await axios.get(`${SAVED_JOB_API_END_POINT}/check/${job?._id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setIsSaved(res.data.saved);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (job?._id) checkSaved();
    }, [job?._id]);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }

    const saveHandler = async () => {
        try {
            const res = await axios.post(`${SAVED_JOB_API_END_POINT}/toggle/${job?._id}`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsSaved(res.data.saved);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Please login to save jobs");
        }
    }
    
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button 
                    onClick={saveHandler}
                    variant="outline" 
                    className={`rounded-full ${isSaved ? 'bg-[#7209b7] text-white hover:bg-[#5f078f]' : ''}`} 
                    size="icon"
                >
                    {isSaved ? <BookmarkCheck /> : <Bookmark />}
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>{job?.location || 'India'}</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button 
                    onClick={saveHandler}
                    className={isSaved ? 'bg-gray-400 hover:bg-gray-500' : 'bg-[#7209b7]'}
                >
                    {isSaved ? 'Saved' : 'Save For Later'}
                </Button>
            </div>
        </div>
    )
}

export default Job