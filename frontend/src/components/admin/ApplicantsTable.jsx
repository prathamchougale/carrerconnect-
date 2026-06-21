import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { setAllApplicants } from '@/redux/applicationSlice';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.put(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            
            if (res.data.success) {
                toast.success(res.data.message);
                
                // Update local state immediately
                const updatedApplications = applicants?.applications?.map((item) => {
                    if (item._id === id) {
                        return { ...item, status: status.toLowerCase() };
                    }
                    return item;
                });
                
                dispatch(setAllApplicants({ ...applicants, applications: updatedApplications }));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item.applicant?.profile?.resume 
                                            ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> 
                                            : <span>NA</span>
                                    }
                                </TableCell>
                               



                                <TableCell>{item?.appliedAt ? item?.appliedAt.split("T")[0] : item?.applicant?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                                        item?.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                        item?.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {item?.status || 'pending'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div 
                                                            onClick={() => statusHandler(status, item?._id)} 
                                                            key={index} 
                                                            className={`flex w-fit items-center my-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${item?.status?.toLowerCase() === status.toLowerCase() ? 'text-green-600 font-bold' : ''}`}
                                                        >
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable