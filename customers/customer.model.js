const mongoose = require('mongoose');

mongoose.model('taskDetails', {

    Member_ID: {
        type: Number,
        required: true
    },
    
    Task_Name: {
        type: String,
        required: true 
    },	
    
    Deliverables: {
        type: String,
        required: true 
    },	
    
    Task_Start_Date: {
        type: String,
        required: true 
    },	
    
    Task_End_Date: {
        type: String,
        required: true 
    }

});