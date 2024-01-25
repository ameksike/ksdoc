export = Documentor;
declare const Documentor_base: typeof import("ksdp/types/src/integration/Dip");
declare class Documentor extends Documentor_base {
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @type {Object|null}
     */
    session: any | null;
    /**
     * @type {Object|null}
     */
    authorizationService: any | null;
    serve: any;
    path: string;
    route: string;
    exts: string;
    cfg: {};
    js: any[];
    css: any[];
    keys: {};
    menu: {};
    sessionKey: string;
    view: string;
    viewAccess: string;
    viewLogin: string;
    viewLogout: string;
    tplHandler: import("ksmf/types/src/view/Tpl");
    setting(configDoc: any): this;
    /**
     *
     * @param {Object} [app]
     * @param {Object} [cfg]
     */
    init(app?: any, cfg?: any): void;
    /**
     *
     * @param {String} source
     * @returns {{ name: String; description: String}}
     */
    loadTopics(source: string): {
        name: string;
        description: string;
    };
    /**
     * @description laod the main manu
     * @param {String} source
     * @param {*} [type]
     * @param {*} [url]
     * @param {*} [pos]
     * @returns
     */
    loadMenu(source: string, type?: any, url?: any, pos?: any): any;
    /**
     * @description get the list of topics to the menu
     * @param {Array<String>|String} source
     * @param {Function} [render]
     * @returns {Object}
     */
    getTopics(source: Array<string> | string, render?: Function): any;
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
     * @param {Request} req
     * @param {Response} res
     */
    login(req: Request, res: Response): Promise<void>;
    logout(req: any, res: any): Promise<void>;
}
