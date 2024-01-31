class SessionService {
    /**
     * @description check the user session
     * @param {String} url 
     * @param {String} key 
     * @param {String} mode 
     * @returns {Function} middleware
     */
    check(url = '/login', key = 'user', mode = 'deep') {
        return (req, res, next) => next();
    }

    /**
     * @description get a session user account 
     * @param {Object} req 
     * @param {String} key 
     * @returns {Object} session
     */
    account(req, key = 'user') { }

    /**
     * @description get request token 
     * @param {Object} req 
     * @param {Object} req.headers.authorization
     * @param {Object} req.query.authorization 
     * @param {Object} req.query.token 
     * @param {Object} req.body.token 
     * @returns {String} token
     */
    getToken(req) { }

    /**
     * @description remove the user session account 
     * @param {Object} req 
     * @param {String} key 
     * @param {Boolean} full 
     * @returns {Object} account
     */
    remove(req, key = 'user', full = true) { }


    /**
     * @description create a new user session 
     * @param {Object} req 
     * @param {String} key 
     * @param {Object} payload 
     * @returns {Object} session account
     */
    create(req, key = 'user', payload = null) { }
}

module.exports = SessionService;