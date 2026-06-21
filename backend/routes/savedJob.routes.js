import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { toggleSaveJob, getSavedJobs, checkSavedStatus } from "../controllers/savedJob.controller.js";

const router = express.Router();

router.post('/toggle/:id', isAuthenticated, toggleSaveJob);
router.get('/get', isAuthenticated, getSavedJobs);
router.get('/check/:id', isAuthenticated, checkSavedStatus);

export default router;