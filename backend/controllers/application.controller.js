import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

import { User } from "../models/user.model.js";


export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        
        // Check if user has uploaded resume
        const user = await User.findById(userId);
        if (!user?.profile?.resume) {
            return res.status(400).json({
                message: "Please upload your resume first before applying.",
                success: false,
                requiresResume: true
            });
        }

        if(!jobId){
            return res.status(400).json({
                message:"Job id is required.",
                success:false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({job:jobId, applicant:userId});

        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this job",
                success:false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        }
       // create a new application
       const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
            status: 'Applied'
       });

       job.applications.push(newApplication._id);
       await job.save();
       return res.status(201).json({
            message:"Job applied successfully.",
            success:true
       })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
            success: false
        });
    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        
        // console.log("Fetching applications for user:", userId);

        // Convert to ObjectId if needed
        let applicantId = userId;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            applicantId = new mongoose.Types.ObjectId(userId);
        }

        const applications = await Application.find({ applicant: applicantId })
            .populate({
                path: 'job',
                populate: {
                    path: 'company'
                }
            })
            .sort({ appliedAt: -1 });

        // console.log("Found applications:", applications.length);
        // console.log("Applications data:", JSON.stringify(applications, null, 2));

        return res.status(200).json({
            applications,
            success: true
        });
    } catch (error) {
        // console.log("Error fetching applications:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            populate: {
                path: 'applicant'
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            applicants: job.applications,
            success: true
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};





export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({
            message:"Internal server error",
            success: false
        });
    }
}