/**
 * Utility function to send a standardized API response
 * @param {Object} res - The Express.js response object
 * @param {boolean} success - Indicates success or failure of the operation
 * @param {string} message - A descriptive message for the response
 * @param {Object} [data={}] - Data payload for the response (optional)
 * @param {number} [statusCode=200] - HTTP status code for the response
 */
function sendResponse({res, status, message, data = null, statusCode = 200, error = ''}) {
    return res.status(statusCode).json({
        status,
        statusCode,
        message,
        data,
        error,
    });
}

module.exports = sendResponse;