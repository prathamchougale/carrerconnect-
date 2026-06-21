import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { setAllAdminJobs } from '@/redux/jobSlice';

const AdminJobsTable = () => {
    const { allAdminJobs } = useSelector(store => store.job);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getJobStatus = (job) => {
        if (!job.deadline) return { label: "Active", color: "bg-green-100 text-green-700" };
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const deadline = new Date(job.deadline);
        deadline.setHours(23, 59, 59, 999);
        
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { label: "Expired", color: "bg-red-100 text-red-700" };
        if (diffDays <= 3) return { label: "Closing Soon", color: "bg-yellow-100 text-yellow-700" };
        return { label: "Active", color: "bg-green-100 text-green-700" };
    };

    const deleteHandler = async (jobId) => {
        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                const updatedJobs = allAdminJobs.filter(job => job._id !== jobId);
                dispatch(setAllAdminJobs(updatedJobs));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete job");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAdminJobs?.map((job) => {
                            const status = getJobStatus(job);
                            return (
                                <TableRow key={job._id}>
                                    <TableCell>{job?.company?.name}</TableCell>
                                    <TableCell>{job?.title}</TableCell>
                                    <TableCell>{job?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </TableCell>
                                    <TableCell>{job?.applications?.length || 0}</TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                            <PopoverContent className="w-32">
                                                <div onClick={() => navigate(`/admin/jobs/${job._id}/edit`)} className='flex items-center gap-2 w-fit cursor-pointer mb-2'>
                                                    <Edit2 className='w-4' />
                                                    <span>Edit</span>
                                                </div>
                                                <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center gap-2 w-fit cursor-pointer mb-2'>
                                                    <Eye className='w-4' />
                                                    <span>Applicants</span>
                                                </div>
                                                <div onClick={() => deleteHandler(job._id)} className='flex items-center gap-2 w-fit cursor-pointer text-red-600 hover:text-red-800'>
                                                    <Trash2 className='w-4' />
                                                    <span>Delete</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable