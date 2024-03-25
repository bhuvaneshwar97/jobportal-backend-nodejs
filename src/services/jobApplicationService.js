const jobApplication = require("../models/jobApplication");

async function addJobApplication(payload) {
    try {
        let data = await payload.save();
        return data;
    } catch (error) {
        throw error;
    }
}
async function displayAllJobApplications(options) {
    try {
        const { page, limit, search } = options;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const totalCount = await jobApplication.countDocuments(query);
        const jobApplications = await jobApplication
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        return { totalCount, currentPage: page, jobApplications };
    } catch (error) {
        throw error;
    }
}
async function deleteApplication(id) {
    try {
        return await jobApplication.findByIdAndDelete(id);
    }
    catch (error) {
        throw error;
    }
}
async function getOneApplicationDetails(id) {
    try {
        return await jobApplication.findById(id);
    }
    catch (error) {
        throw error;
    }
}
async function updateOneApplicationDetails(id, payload, files) {
    let applicantDetails, duplicateData;
    try {
        duplicateData = await jobApplication.findOne({ _id: { $ne: id }, $or: [{ name: new RegExp(`^${payload.name}$`, 'i') }, { phone: payload.phone }] });
        if (duplicateData) {
            throw Error("Job application details already exist!");
        }
        applicantDetails = await jobApplication.findById(id);
        if (applicantDetails && files && applicantDetails.additionalDocs && files.additionalDocs && (applicantDetails.additionalDocs.length + files.additionalDocs.length) > 5) {
            throw Error("Additional documents should not be more than 5 documents!");
        }
        if (applicantDetails) {
            applicantDetails.name = payload.name ? payload.name : applicantDetails.name;
            applicantDetails.dob = payload.dob ? payload.dob : applicantDetails.dob;
            applicantDetails.city = payload.city ? payload.city : applicantDetails.city;
            applicantDetails.description = payload.description ? payload.description : applicantDetails.description;
            applicantDetails.phone = payload.phone ? payload.phone : applicantDetails.phone;
            applicantDetails.resume = files && files['resume'] && files['resume'][0].filename ? files['resume'][0].filename : applicantDetails.resume;
            if (files && files['additionalDocs'] && files.additionalDocs.length > 0) {
                let docs = applicantDetails.additionalDocs;
                files.additionalDocs.map(data => {
                    docs.push(data.path);
                })
                applicantDetails.additionalDocs = docs;
            }
            try {
                return await applicantDetails.save();
            }
            catch (e) {
                throw e;
            }
        }
    }
    catch (error) {
        throw error;
    }
}
module.exports = { addJobApplication, displayAllJobApplications, deleteApplication, getOneApplicationDetails, updateOneApplicationDetails };