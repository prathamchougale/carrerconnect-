import React from 'react'
import { X } from 'lucide-react'

const FilterSidebar = ({ filters, setFilters, activeFilters, removeFilter, clearAllFilters }) => {
    
    const locations = ['Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Chennai', 'Remote'];
    const industries = ['Frontend Developer', 'Backend Developer', 'FullStack Developer', 'DevOps', 'Data Science', 'Mobile Developer'];
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    const experienceLevels = [
        { value: 'fresher', label: 'Fresher (0 years)' },
        { value: '1-2', label: '1-2 Years' },
        { value: '3-5', label: '3-5 Years' },
        { value: '5+', label: '5+ Years' }
    ];
    const salaryRanges = [
        { min: 0, max: 4, label: '0-4 LPA' },
        { min: 4, max: 10, label: '4-10 LPA' },
        { min: 10, max: 20, label: '10-20 LPA' },
        { min: 20, max: 50, label: '20-50 LPA' },
        { min: 50, max: 100, label: '50+ LPA' }
    ];

    const toggleFilter = (type, value) => {
        setFilters(prev => {
            const current = prev[type] || [];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    const toggleSalary = (min, max) => {
        setFilters(prev => ({
            ...prev,
            salaryMin: prev.salaryMin === min ? '' : min,
            salaryMax: prev.salaryMax === max ? '' : max
        }));
    };

    const isSelected = (type, value) => {
        return (filters[type] || []).includes(value);
    };

    return (
        <div className="w-64 shrink-0">
            {/* Active Filter Chips */}
            {activeFilters.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">Active Filters</h3>
                        <button 
                            onClick={clearAllFilters}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {activeFilters.map((filter, idx) => (
                            <span 
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                            >
                                {filter.label}
                                <button 
                                    onClick={() => removeFilter(filter.type, filter.value)}
                                    className="hover:text-purple-900"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <h2 className="font-bold text-lg mb-4">Filter Jobs</h2>

            {/* Location */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Location</h3>
                <div className="space-y-2">
                    {locations.map(loc => (
                        <label key={loc} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected('location', loc)}
                                onChange={() => toggleFilter('location', loc)}
                                className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">{loc}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Industry */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Industry</h3>
                <div className="space-y-2">
                    {industries.map(ind => (
                        <label key={ind} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected('industry', ind)}
                                onChange={() => toggleFilter('industry', ind)}
                                className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">{ind}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Job Type */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Job Type</h3>
                <div className="space-y-2">
                    {jobTypes.map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected('jobType', type)}
                                onChange={() => toggleFilter('jobType', type)}
                                className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Experience */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Experience</h3>
                <div className="space-y-2">
                    {experienceLevels.map(exp => (
                        <label key={exp.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected('experience', exp.value)}
                                onChange={() => toggleFilter('experience', exp.value)}
                                className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">{exp.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Salary */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Salary Range</h3>
                <div className="space-y-2">
                    {salaryRanges.map(range => (
                        <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="salary"
                                checked={filters.salaryMin === range.min && filters.salaryMax === range.max}
                                onChange={() => toggleSalary(range.min, range.max)}
                                className="w-4 h-4 accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FilterSidebar