import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

const EditJob = () => {
    const params = useParams();
    const jobId = params.id;
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);
    
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: "",
        companyId: "",
        deadline: ""
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Fetch job details
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    const job = res.data.job;
                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        requirements: job.requirements?.join(",") || "",
                        salary: job.salary || "",
                        location: job.location || "",
                        jobType: job.jobType || "",
                        experience: job.experienceLevel || "",
                        position: job.position || "",
                        companyId: job.company?._id || "",
                        deadline: job.deadline ? job.deadline.split("T")[0] : ""
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch job details");
            } finally {
                setFetchLoading(false);
            }
        };
        if (jobId) fetchJob();
    }, [jobId]);







    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate numbers
        if (isNaN(Number(input.salary)) || input.salary === "") {
            toast.error("Salary must be a valid number");
            return;
        }
        if (isNaN(Number(input.experience)) || input.experience === "") {
            toast.error("Experience must be a valid number");
            return;
        }
        if (isNaN(Number(input.position)) || input.position === "") {
            toast.error("Position must be a valid number");
            return;
        }

        const formattedInput = {
            ...input,
            salary: Number(input.salary),
            experience: Number(input.experience),
            position: Number(input.position),
            requirements: input.requirements,
            deadline: input.deadline ? new Date(input.deadline).toISOString() : null
        };

        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, formattedInput, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update job");
        } finally {
            setLoading(false);
        }
    }

    if (fetchLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-[#7209b7]" />
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 p-8'>
                        <Button onClick={() => navigate("/admin/jobs")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Edit Job</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                placeholder="Job title"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                placeholder="Job description"
                            />
                        </div>
                        <div>
                            <Label>Requirements (comma separated)</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                placeholder="React, Node.js, MongoDB"
                            />
                        </div>
                        <div>
                            <Label>Salary (LPA)</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                placeholder="e.g. 5"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                placeholder="e.g. Mumbai"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                placeholder="e.g. Full-time"
                            />
                        </div>
                        <div>
                            <Label>Experience Level (years)</Label>
                            <Input
                                type="number"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                placeholder="e.g. 2"
                            />
                        </div>
                        <div>
                            <Label>No of Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                placeholder="e.g. 3"
                            />
                        </div>
                        <div>
                            <Label>Application Deadline</Label>
                            <Input
                                type="date"
                                name="deadline"
                                value={input.deadline}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Company</Label>
                            <select
                                name="companyId"
                                value={input.companyId}
                                onChange={changeEventHandler}
                                className="w-full border rounded-md p-2"
                            >
                                <option value="">Select Company</option>
                                {companies?.map((company) => (
                                    <option key={company._id} value={company._id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {
                        loading 
                            ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button> 
                            : <Button type="submit" className="w-full my-4">Update Job</Button>
                    }
                </form>
            </div>
        </div>
    )
}

export default EditJob