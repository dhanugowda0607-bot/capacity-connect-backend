const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const Resource = require("../models/Resource");

router.post("/upload",authMiddleware,roleMiddleware("Trainer"),upload.single("resource"), async (req, res) => {
    try {
        if (req.user.role !== "Trainer") {
    return res.status(403).json({
        message: "Only trainers can upload resources"
    });
}
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const resource = new Resource({
            name: req.file.originalname,
            filePath: req.file.path,
            uploadedBy: "Trainer"
        });

        await resource.save();

        res.status(201).json({
            message: "Resource uploaded successfully",
            resource: resource
        });

    } catch (error) {
        res.status(500).json({
            message: "Error uploading resource",
            error: error.message
        });
    }
});
// Get all resources for trainees
router.get("/",authMiddleware, async (req, res) => {
    try {
        const resources = await Resource.find();

        res.status(200).json({
            message: "Resources fetched successfully",
            resources: resources
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching resources",
            error: error.message
        });
    }
});
router.get("/download/:id", async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found"
            });
        }

        res.download(resource.filePath, resource.name);

    } catch (error) {
        res.status(500).json({
            message: "Error downloading resource",
            error: error.message
        });
    }
});
module.exports = router;