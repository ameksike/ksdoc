export = DocumentModule;
declare const DocumentModule_base: typeof import("ksdp/types/src/integration/Dip");
declare class DocumentModule extends DocumentModule_base {
    /**
     * @description Document Controller
     * @type {ContentController|null}
     */
    contentController: ContentController | null;
    /**
     * @description Schema Controller
     * @type {SchemaController|null}
     */
    schemaController: SchemaController | null;
    /**
     * @description Document Controller
     * @type {SwaggerController|null}
     */
    apiController: SwaggerController | null;
    /**
     * @description Content Service
     * @type {SchemaService|null}
     */
    schemaService: SchemaService | null;
    /**
     * @description Content Service
     * @type {ContentService|null}
     */
    contentService: ContentService | null;
    /**
     * @description Session Service
     * @type {Object|null}
     */
    sessionService: any | null;
    /**
     * @description Config Service
     * @type {ConfigService|null}
     */
    configService: ConfigService | null;
    /**
     * @description Language Service
     * @type {LanguageService|null}
     */
    languageService: LanguageService | null;
    /**
     * @description Menu Service
     * @type {MenuService|null}
     */
    menuService: MenuService | null;
    /**
     * @description Authorization Service
     * @type {Object|null}
     */
    authService: any | null;
    /**
     * @description Data Service
     * @type {Object|null}
     */
    dataService: any | null;
    /**
     * @description logger
     * @type {Object}
     */
    logger: any;
    /**
     * @description Template engine
     * @type {Object}
     */
    tplService: any;
    /**
     * @description all configurations
     * @type {Object}
     */
    cfg: any;
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
     * @description all templates
     * @type {Object}
     */
    template: any;
    /**
     * @description resolve URL
     * @param {String} key
     * @param {Object} option
     * @returns {String} url
     */
    getRoute(key: string, option: any): string;
    /**
     * @description configure the Document module
     * @param {Object|null} option
     * @returns {DocumentModule} self
     */
    configure(option?: any | null): DocumentModule;
    /**
     * @description schema reconfiguration
     * @param {Object} [req]
     * @param {Object} [req.ksdoc]
     * @param {Object} [req.params]
     * @param {String} [req.params.schema]
     * @returns {Promise<DocumentModule>} self
     */
    load(req?: {
        ksdoc?: any;
        params?: {
            schema?: string;
        };
    }): Promise<DocumentModule>;
    /**
     * @description controller delegation
     * @param {Object} req
     * @param {Object} res
     * @param {Object} next
     * @param {String} srv
     * @param {String} act
     */
    delegate(req: any, res: any, next: any, srv: string, act: string): Promise<any>;
    /**
     * @description initialize the module
     * @param {Object} app
     * @param {Function|null} [publish]
     * @param {Object|null} [cfg]
     */
    init(app: any, publish?: Function | null, cfg?: any | null): this;
}
import ContentController = require("./controller/Content");
import SchemaController = require("./controller/Schema");
import SwaggerController = require("./controller/Swagger");
import SchemaService = require("./service/Schema");
import ContentService = require("./service/Content");
import ConfigService = require("./service/Config");
import LanguageService = require("./service/Language");
import MenuService = require("./service/Menu");
