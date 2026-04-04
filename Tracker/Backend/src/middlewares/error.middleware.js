const handleError = (err, req, res, next) => {
    const response = {
        message: err.message || "Internal Server Error",
    };

    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(err.statusCode || 500).json(response);
};

export default handleError;
