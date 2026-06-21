import { SavedJob } from "../models/savedJob.model.js";

export const toggleSaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        // Check if already saved
        const existing = await SavedJob.findOne({ user: userId, job: jobId });

        if (existing) {
            // Unsave (delete)
            await SavedJob.findByIdAndDelete(existing._id);
            return res.status(200).json({
                message: "Job removed from saved list",
                saved: false,
                success: true
            });
        } else {
            // Save
            await SavedJob.create({ user: userId, job: jobId });
            return res.status(201).json({
                message: "Job saved successfully",
                saved: true,
                success: true
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const savedJobs = await SavedJob.find({ user: userId })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name logo' // adjust based on your Company model
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            savedJobs: savedJobs
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch saved jobs",
            success: false
        });
    }
};

export const checkSavedStatus = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        const saved = await SavedJob.findOne({ user: userId, job: jobId });

        return res.status(200).json({
            saved: !!saved,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};