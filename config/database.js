var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/kuukua',{ useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(!err){
        console.log("Server has been connected to MongoDB");
    }
});

module.exports = mongoose;
