// Wrap async route handlers to catch errors and pass them to Express error handler
// This is an alternative to using try-catch blocks in each async route handler


module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

