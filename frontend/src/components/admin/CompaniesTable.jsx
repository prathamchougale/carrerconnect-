import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Trash2, Eye, ExternalLink } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setCompanies } from '@/redux/companySlice'

// import { setAllAdminJobs } from '@/redux/jobSlice';

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const [companyJobCounts, setCompanyJobCounts] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    // Fetch job counts for each company
    useEffect(() => {
        const fetchJobCounts = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    const counts = {};
                    res.data.jobs.forEach(job => {
                        const companyId = job.company?._id;
                        if (companyId) {
                            counts[companyId] = (counts[companyId] || 0) + 1;
                        }
                    });
                    setCompanyJobCounts(counts);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchJobCounts();
    }, []);

    const deleteHandler = async (companyId) => {
        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                const updatedCompanies = companies.filter(c => c._id !== companyId);
                dispatch(setCompanies(updatedCompanies));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete company");
        }
    }


    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total Jobs</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <TableRow key={company._id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={company.logo} />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell>{companyJobCounts[company._id] || 0}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-40">
                                            <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer mb-2'>
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                            <div onClick={() => navigate(`/admin/companies/${company._id}/view`)} className='flex items-center gap-2 w-fit cursor-pointer mb-2'>
                                                <Eye className='w-4' />
                                                <span>View Details</span>
                                            </div>
                                            {company.website && (
                                                <a href={company.website} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2 w-fit cursor-pointer mb-2 text-blue-600 hover:text-blue-800'>
                                                    <ExternalLink className='w-4' />
                                                    <span>Visit Website</span>
                                                </a>
                                            )}
                                            <div onClick={() => deleteHandler(company._id)} className='flex items-center gap-2 w-fit cursor-pointer text-red-600 hover:text-red-800'>
                                                <Trash2 className='w-4' />
                                                <span>Delete</span>
                                            </div>
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

export default CompaniesTable










