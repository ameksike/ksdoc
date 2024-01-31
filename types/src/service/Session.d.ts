export = SessionService;
declare class SessionService {
    /**
     * @description check the user session
     * @param {String} url
     * @param {String} key
     * @param {String} mode
     * @returns {Function} middleware
     */
    check(url?: string, key?: string, mode?: string): Function;
    /**
     * @description get a session user account
     * @param {Object} req
     * @param {String} key
     * @returns {Object} session
     */
    account(req: any, key?: string): any;
    /**
     * @description get request token
     * @param {Object} req
     * @returns {String} token
     */
    getToken(req: any): string;
    /**
     * @description remove the user session account
     * @param {Object} req
     * @param {String} key
     * @param {Boolean} full
     * @returns {Object} account
     */
    remove(req: any, key?: string, full?: boolean): any;
    /**
     * @description create a new user session
     * @param {Object} req
     * @param {String} key
     * @param {Object} payload
     * @returns {Object} session account
     */
    create(req: any, key?: string, payload?: any): any;
}
