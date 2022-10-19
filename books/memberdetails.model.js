const mongoose = require('mongoose');

mongoose.model('memberdetails', {
    Member_ID: {
        type: Number,
        required: true
    },
    Member_Name: {
        type: String,
        required: true
    },
    Total_Exp: {
        type: Number,
        required: false
    },
    Skillset: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: false
    },
    Project_start_date: {
        type: String,
        required: false
    },
    Project_end_date: {
        type: String,
        required: false
    },
    Allocation_percentage: {
        type: Number,
        required: false
    }
});