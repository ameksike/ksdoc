export = SchemaController;
declare const SchemaController_base: typeof import("ksdp/types/src/integration/Dip");
declare class SchemaController extends SchemaController_base {
    /**
     * @description Document Controller
     * @type {Object|null}
     */
    configService: any | null;
    /**
     * @description Content Service
     * @type {Object|null}
     */
    contentService: any | null;
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
    schemaService: any | null;
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
    show(req: any, res: any): Promise<any>;
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
}
