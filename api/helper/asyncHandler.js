const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        const statusCode = typeof error.code === 'number' && error.code >= 400 && error.code < 600 ? error.code : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export default asyncHandler;
