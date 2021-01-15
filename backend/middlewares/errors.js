const ErrorHandler = require('../utils/errorHandler');



module.exports = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    
    // Show the errors in development mode
    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    // Show the errors in production mode
    if (process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}

        error.message = err.message

        res.status(err.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
    }

}

