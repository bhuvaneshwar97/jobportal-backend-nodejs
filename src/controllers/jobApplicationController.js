const { addJobApplication, displayAllJobApplications, deleteApplication, getOneApplicationDetails, updateOneApplicationDetails } = require("../services/jobApplicationService");
const jobApplication = require("../models/jobApplication");
const fs = require("fs");
const archiver = require("archiver");

async function createJobApplication(req, res) {
    try {
        const { name, dob, city, phone, description } = req.body;
        const resumePath = req.files['resume'][0].filename;
        const additionalDocsPaths = req.files['additionalDocs'].map(file => file.path);
        const newJobApplication = new jobApplication({
            name,
            dob,
            city,
            phone,
            description,
            resume: resumePath,
            additionalDocs: additionalDocsPaths,
        });
        let myApplication = await addJobApplication(newJobApplication);
        if (myApplication !== null || myApplication !== "") {
            res.status(201).json("Job Application created successfully");
        } else {
            res.status(500).json("Job Application creation failed");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
async function listJobApplications(req, res) {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            search: search.trim()
        };
        const jobApplications = await displayAllJobApplications(options);
        res.json(jobApplications);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
async function downloadResume(req, res) {
    try {
        const { id } = req.params;
        const filePath = './public/uploads/' + id;
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.download(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
async function downloadAdditionalDocs(req, res) {
    try {
        const { id } = req.params;
        const data = await jobApplication.findById(id);
        if (!data) {
            throw new Error('Data not found');
        }
        const files = data.additionalDocs;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files provided' });
        }
        const zipFileName = 'AdditionalDocs.zip';
        const output = fs.createWriteStream(zipFileName);
        const archive = archiver('zip', { zlib: { level: 9 } });
        output.on('close', () => {
            res.download(zipFileName, zipFileName, (err) => {
                if (err) {
                    console.error('Error downloading zip file:', err);
                }
                fs.unlinkSync(zipFileName);
            });
        });

        archive.on('error', (err) => {
            console.error('Error creating zip file:', err);
            res.status(500).json({ error: 'Error creating ZIP archive' });
        });

        archive.pipe(output);
        for (const file of files) {
            const fileName = file.substring(file.lastIndexOf('\\') + 1);
            archive.file(file, { name: fileName });
        }
        archive.finalize();
    } catch (error) {
        console.error('Error creating zip file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function deleteJobApplication(req, res) {
    try {
        const jobApplication = await deleteApplication(req.params.id);
        res.json(jobApplication);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
async function getOneJobApplicationDetails(req, res) {
    try {
        const jobApplication = await getOneApplicationDetails(req.params.id);
        res.json(jobApplication);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
async function updateOneJobApplicationDetails(req, res) {
    try {
        const jobApplication = await updateOneApplicationDetails(req.params.id, req.body, req.files);
        res.json(jobApplication);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
module.exports = { createJobApplication, listJobApplications, downloadResume, downloadAdditionalDocs, deleteJobApplication, getOneJobApplicationDetails, updateOneJobApplicationDetails };