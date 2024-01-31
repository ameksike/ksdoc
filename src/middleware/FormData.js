
/**
 * @description add suppor for formData format
 * @returns {Function} middleware
 */
function support() {
    const multer = require('multer');
    const upload = multer();
    return upload.any()
}

module.exports = {
    support
};