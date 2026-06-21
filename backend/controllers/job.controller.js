import { Job } from "../models/job.model.js";


export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        }
        
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        });
        
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const { 
            location, 
            industry, 
            salaryMin, 
            salaryMax,
            jobType,
            experience,
            sortBy = 'newest'
        } = req.query;

        // Build query
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        // Multi-select Location (comma-separated)
        if (location) {
            const locations = location.split(',').filter(Boolean);
            if (locations.length > 0) {
                query.location = { $in: locations.map(l => new RegExp(l, 'i')) };
            }
        }

        // Multi-select Industry (search in title/description)
        if (industry) {
            const industries = industry.split(',').filter(Boolean);
            if (industries.length > 0) {
                query.$or = [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { title: { $in: industries.map(i => new RegExp(i, 'i')) } }
                ];
            }
        }

        // Multi-select Job Type
        if (jobType) {
            const types = jobType.split(',').filter(Boolean);
            if (types.length > 0) {
                query.jobType = { $in: types };
            }
        }

        // Experience Level
        if (experience) {
            const expLevels = experience.split(',').filter(Boolean);
            const expQuery = [];
            
            expLevels.forEach(exp => {
                if (exp === 'fresher') expQuery.push({ experienceLevel: { $lte: 0 } });
                else if (exp === '1-2') expQuery.push({ experienceLevel: { $gte: 1, $lte: 2 } });
                else if (exp === '3-5') expQuery.push({ experienceLevel: { $gte: 3, $lte: 5 } });
                else if (exp === '5+') expQuery.push({ experienceLevel: { $gte: 5 } });
            });
            
            if (expQuery.length > 0) {
                query.$and = query.$and ? [...query.$and, { $or: expQuery }] : [{ $or: expQuery }];
            }
        }

        // Salary Range
        if (salaryMin || salaryMax) {
            query.salary = {};
            if (salaryMin) query.salary.$gte = Number(salaryMin);
            if (salaryMax) query.salary.$lte = Number(salaryMax);
        }

        // Sorting
        let sortOption = {};
        switch (sortBy) {
            case 'salary-high':
                sortOption = { salary: -1 };
                break;
            case 'salary-low':
                sortOption = { salary: 1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'newest':
            default:
                sortOption = { createdAt: -1 };
                break;
        }

        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort(sortOption);

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                success: true,
                jobs: [],
                message: "No jobs found matching your criteria"
            });
        }

        return res.status(200).json({
            success: true,
            jobs,
            count: jobs.length
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// student - get single job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        const job = await Job.findById(jobId)
            .populate({ path: "company" })
            .populate({
                path: "applications",
                populate: {
                    path: "applicant",
                    select: "_id fullname email profile.profilePhoto"
                }
            });
            
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        }
        
        return res.status(200).json({ 
            job, 
            success: true 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });
            
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        }
        
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const updateJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, deadline } = req.body;
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findOne({ _id: jobId, created_by: userId });
        if (!job) {
            return res.status(404).json({
                message: "Job not found or you don't have permission.",
                success: false
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (requirements) updateData.requirements = requirements.split(",");
        if (salary) updateData.salary = Number(salary);
        if (location) updateData.location = location;
        if (jobType) updateData.jobType = jobType;
        if (experience) updateData.experienceLevel = Number(experience);
        if (position) updateData.position = Number(position);
        if (companyId) updateData.company = companyId;
        if (deadline) updateData.deadline = new Date(deadline);

        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

        return res.status(200).json({
            message: "Job updated successfully.",
            job: updatedJob,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        // Debug: log the IDs
        console.log("Job ID:", jobId);
        console.log("User ID from token:", req.id);

        const job = await Job.findById(jobId);  // <-- Remove created_by check temporarily

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}