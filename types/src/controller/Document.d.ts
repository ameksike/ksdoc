export = DocumentController;
declare const DocumentController_base: typeof import("ksdp/types/src/integration/Dip");
declare class DocumentController extends DocumentController_base {
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
     * @description render the document content
     * @param {Request} req
     * @param {Response} res
     */
    show(req: Request, res: Response): Promise<void>;
    /**
     * @description add or update documents
     * @param {Request} req
     * @param {Response} res
     */
    save(req: Request, res: Response): Promise<any>;
    /**
     * @description delete documents
     * @param {Request} req
     * @param {Response} res
     */
    delete(req: Request, res: Response): Promise<any>;
    /**
     * @description
     * @param {Request} req
     * @param {Response} res
     */
    access(req: Request, res: Response): Promise<void>;
    /**
     * @description login action
     * @param {Object} req
     * @param {String} [req.flow]
     * @param {Object} res
     */
    login(req: {
        flow?: string;
    }, res: any): Promise<void>;
    /**
     *
     * @param {Object} req
     * @param {String} [req.flow]
     * @param {Object} [req.body]
     * @param {Object} res
     */
    logout(req: {
        flow?: string;
        body?: any;
    }, res: any): Promise<void>;
}
