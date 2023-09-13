const ApiError = require('../exceptions/api-error')

module.exports = function (err, req, res, next) {
    const { status, message, errors } = err

    if (err instanceof ApiError) {
        return res.status(status).json({ message, errors })
    }

    return res.status(500).json({ message: 'Unexpected error' })
}
