import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName || companyName.trim() === "") {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        if (companyName.trim().length < 2) {
            return res.status(400).json({
                message: "Company name must be at least 2 characters long.",
                success: false
            });
        }

        if (companyName.trim().length > 100) {
            return res.status(400).json({
                message: "Company name cannot exceed 100 characters.",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName.trim() });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            });
        }

        company = await Company.create({
            name: companyName.trim(),
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
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

//  ADD THIS FUNCTION - Get all companies for logged in user
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });
        
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "No companies found.",
                success: false
            })
        }
        
        return res.status(200).json({
            companies,
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

// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        if (!companyId || companyId.length !== 24) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false
            });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }

        return res.status(200).json({
            company,
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

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        if (!name && !description && !website && !location && !req.file) {
            return res.status(400).json({
                message: "Please provide at least one field to update.",
                success: false
            });
        }

        if (name && name.trim().length < 2) {
            return res.status(400).json({
                message: "Company name must be at least 2 characters long.",
                success: false
            });
        }

        if (website && !website.startsWith('http')) {
            return res.status(400).json({
                message: "Website must start with http:// or https://",
                success: false
            });
        }

        if (description && description.length > 1000) {
            return res.status(400).json({
                message: "Description cannot exceed 1000 characters.",
                success: false
            });
        }

        const file = req.file;
        let logo;

        if (file) {
            const fileUri = getDataUri(file);
            if (fileUri && fileUri.content) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                logo = cloudResponse.secure_url;
            }
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (website) updateData.website = website.trim();
        if (location) updateData.location = location.trim();
        if (logo) updateData.logo = logo;

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }

        return res.status(200).json({
            message: "Company information updated.",
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

import { Job } from "../models/job.model.js";  // <-- ADD THIS IMPORT at top

export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.id;

        if (!companyId || companyId.length !== 24) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false
            });
        }

        const company = await Company.findOne({ _id: companyId, userId: userId });

        if (!company) {
            return res.status(404).json({
                message: "Company not found or you don't have permission to delete it.",
                success: false
            });
        }

        // Delete all jobs associated with this company
        await Job.deleteMany({ company: companyId });

        // Then delete the company
        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: "Company and its jobs deleted successfully.",
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




