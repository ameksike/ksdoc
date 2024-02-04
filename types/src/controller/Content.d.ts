export = ContentController;
declare const ContentController_base: typeof import("ksdp/types/src/integration/Dip");
declare class ContentController extends ContentController_base {
    /**
     * @description Document Controller
     * @type {Object|null}
     */
    configService: any | null;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @type {Object|null}
     */
    sessionService: any | null;
    /**
     * @type {Object|null}
     */
    authService: any | null;
    /**
     * @type {Object|null}
     */
    contentService: any | null;
    /**
     * @description all path
     * @type {Object}
     */
    path: any;
    /**
     * @description all routes
     * @type {Object}
     */
    route: any;
    /**
     * @description all configurations
     * @type {Object}
     */
    cfg: any;
    /**
     * @description render the document content
     * @param {Object} req
     * @param {Object} res
     */
    show(req: any, res: any): Promise<void>;
    /**
     * @description check user sessions
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    check(req: any, res: any, next: any): Promise<any>;
    /**
     * @description add or update documents
     * @param {Object} req
     * @param {Object} res
     */
    save(req: any, res: any): Promise<any>;
    /**
     * @description delete documents
     * @param {Object} req
     * @param {Object} res
     */
    delete(req: any, res: any): Promise<any>;
    /**
     * @description show the login page
     * @param {Object} req
     * @param {Object} res
     */
    access(req: any, res: any): Promise<void>;
    /**
     * @description login action
     * @param {Object} req
     * @param {String} [req.flow]
     * @param {Object} [req.body]
     * @param {String} [req.body.client_id]
     * @param {String} [req.body.client_secret]
     * @param {String} [req.body.username]
     * @param {String} [req.body.password]
     * @param {String} [req.body.scope]
     * @param {String} [req.body.user_agent]
     * @param {String} [req.body.grant_type]
     * @param {Object} [req.query]
     * @param {String} [req.query.redirectUrl]
     * @param {String} [req.query.schema]
     * @param {String} [req.query.mode]
     * @param {Object} [req.headers]
     * @param {Object} [req.params]
     * @param {Object} res
     */
    login(req: {
        flow?: string;
        body?: {
            client_id?: string;
            client_secret?: string;
            username?: string;
            password?: string;
            scope?: string;
            user_agent?: string;
            grant_type?: string;
        };
        query?: {
            redirectUrl?: string;
            schema?: string;
            mode?: string;
        };
        headers?: any;
        params?: any;
    }, res: any): Promise<void>;
    /**
     *
     * @param {Object} req
     * @param {String} [req.flow]
     * @param {Object} [req.body]
     * @param {Object} [req.params]
     * @param {String} [req.params.schema]
     * @param {Object} res
     */
    logout(req: {
        flow?: string;
        body?: any;
        params?: {
            schema?: string;
        };
    }, res: any): Promise<void>;
}
