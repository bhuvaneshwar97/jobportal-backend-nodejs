const express = require("express");
const { createJobApplication, listJobApplications, downloadResume, downloadAdditionalDocs, deleteJobApplication, getOneJobApplicationDetails, updateOneJobApplicationDetails, searchJobApplications } = require("../controllers/jobApplicationController");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let UploadDir = path.join(__dirname + '../../../public/uploads/');
        let dir = './public/uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }, err => {
                if (err) {
                    throw Error('Error creating uploads directory:', err);
                }
            });
        }
        cb(null, UploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/addjobapplication', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'additionalDocs', maxCount: 3 }]), createJobApplication);
router.get('/getallapplications', listJobApplications);
router.get('/downloadResume/:id', downloadResume);
router.get('/downloadAdditionalDocs/:id', downloadAdditionalDocs);
router.delete('/deletejobapplication/:id', deleteJobApplication);
router.get('/getonejobapplicationdetails/:id', getOneJobApplicationDetails);
router.put('/updatejobapplicationdetails/:id', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'additionalDocs', maxCount: 5 }]), updateOneJobApplicationDetails);

module.exports = router;
