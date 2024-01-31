export = DocumentModule;
declare const DocumentModule_base: typeof import("ksdp/types/src/integration/Dip");
declare class DocumentModule extends DocumentModule_base {
    /**
     * @description Document Controller
     * @type {DocumentController|null}
     */
    controller: DocumentController | null;
    /**
     * @description Document Controller
     * @type {SwaggerController|null}
     */
    apiController: SwaggerController | null;
    /**
     * @description Document Controller
     * @type {ContentService|null}
     */
    contentService: ContentService | null;
    /**
     * @description Document Controller
     * @type {SessionService|null}
     */
    sessionService: SessionService | null;
    /**
     * @description Document Controller
     * @type {LanguageService|null}
     */
    languageService: LanguageService | null;
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
     * @description configure the Document module
     * @param {Object} option
     * @returns {DocumentModule} self
     */
    configure(option: any): DocumentModule;
    /**
     * @description initialize the module
     * @param {Object} app
     * @param {Function|null} [publish]
     * @param {Object|null} [cfg]
     */
    init(app: any, publish?: Function | null, cfg?: any | null): this;
}
import DocumentController = require("./controller/Document");
import SwaggerController = require("./controller/Swagger");
import ContentService = require("./service/Content");
import SessionService = require("./service/Session");
import LanguageService = require("./service/Language");
