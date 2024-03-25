const { default: mongoose } = require("mongoose");

const jobApplicationsSchema = mongoose.Schema({
    name: String,
    dob: Date,
    city: String,
    resume: String,
    additionalDocs: [String],
    phone: String,
    description: String
})

const jobApplication = mongoose.model("JobApplication", jobApplicationsSchema);
module.exports = jobApplication;