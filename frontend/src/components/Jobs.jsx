import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import FilterSidebar from './FilterSidebar'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    
    // Multi-select filters
    const [filters, setFilters] = useState({
        location: [],
        industry: [],
        jobType: [],
        experience: [],
        salaryMin: '',
        salaryMax: ''
    });

    const dispatch = useDispatch();

    // Build active filter chips
    const getActiveFilters = () => {
        const active = [];
        filters.location.forEach(l => active.push({ type: 'location', value: l, label: l }));
        filters.industry.forEach(i => active.push({ type: 'industry', value: i, label: i }));
        filters.jobType.forEach(j => active.push({ type: 'jobType', value: j, label: j }));
        filters.experience.forEach(e => {
            const label = e === 'fresher' ? 'Fresher' : e === '1-2' ? '1-2 Years' : e === '3-5' ? '3-5 Years' : '5+ Years';
            active.push({ type: 'experience', value: e, label: label });
        });
        if (filters.salaryMin !== '' && filters.salaryMax !== '') {
            active.push({ type: 'salary', value: `${filters.salaryMin}-${filters.salaryMax}`, label: `${filters.salaryMin}-${filters.salaryMax} LPA` });
        }
        return active;
    };

    const removeFilter = (type, value) => {
        if (type === 'salary') {
            setFilters(prev => ({ ...prev, salaryMin: '', salaryMax: '' }));
        } else {
            setFilters(prev => ({
                ...prev,
                [type]: prev[type].filter(item => item !== value)
            }));
        }
    };

    const clearAllFilters = () => {
        setFilters({
            location: [],
            industry: [],
            jobType: [],
            experience: [],
            salaryMin: '',
            salaryMax: ''
        });
        dispatch(setSearchedQuery(''));
    };

    const fetchJobs = async () => {
        try {
            setLoading(true);
            
            // Build query params
            const params = new URLSearchParams();
            if (searchedQuery) params.append('keyword', searchedQuery);
            if (sortBy) params.append('sortBy', sortBy);
            if (filters.location.length) params.append('location', filters.location.join(','));
            if (filters.industry.length) params.append('industry', filters.industry.join(','));
            if (filters.jobType.length) params.append('jobType', filters.jobType.join(','));
            if (filters.experience.length) params.append('experience', filters.experience.join(','));
            if (filters.salaryMin !== '') params.append('salaryMin', filters.salaryMin);
            if (filters.salaryMax !== '') params.append('salaryMax', filters.salaryMax);

            const res = await axios.get(`${JOB_API_END_POINT}/get?${params.toString()}`, { withCredentials: true });
            
            if (res.data.success) {
                setJobs(res.data.jobs);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [searchedQuery, filters, sortBy]);

    return (
        <div>
            <Navbar />
            
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                {/* Search + Sort Bar */}
                <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center gap-2 text-gray-600'>
                        <SlidersHorizontal size={20} />
                        <span className='font-medium'>Filter Jobs</span>
                    </div>
                    
                    {/* Sort Dropdown */}
                    <div className='flex items-center gap-2'>
                        <ArrowUpDown size={18} className='text-gray-500' />
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className='border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="salary-high">Salary: High to Low</option>
                            <option value="salary-low">Salary: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className='mb-4 text-sm text-gray-500'>
                    Showing <span className='font-semibold text-gray-800'>{jobs.length}</span> jobs
                    {searchedQuery && ` for "${searchedQuery}"`}
                </div>

                <div className='flex gap-6'>
                    {/* Filter Sidebar */}
                    <FilterSidebar 
                        filters={filters}
                        setFilters={setFilters}
                        activeFilters={getActiveFilters()}
                        removeFilter={removeFilter}
                        clearAllFilters={clearAllFilters}
                    />

                    {/* Job Grid */}
                    <div className='flex-1'>
                        {loading ? (
                            <div className='flex items-center justify-center h-64'>
                                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className='text-center py-16'>
                                <p className='text-gray-500 text-lg'>No jobs found matching your criteria</p>
                                <button 
                                    onClick={clearAllFilters}
                                    className='mt-4 text-purple-600 hover:underline'
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {jobs.map((job) => (
                                    <Job key={job._id} job={job} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs