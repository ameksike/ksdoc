declare const _exports: {
    cls: {
        module: {
            Document: typeof Document;
        };
        controller: {
            Schema: typeof import("./src/controller/Schema");
            Content: typeof import("./src/controller/Content");
            Swagger: typeof import("./src/controller/Swagger");
        };
        service: {
            Schema: typeof import("./src/service/Schema");
            Content: typeof import("./src/service/Content");
            Session: typeof import("./src/service/Session");
            Language: typeof import("./src/service/Language");
            Config: typeof import("./src/service/Config");
            Menu: typeof import("./src/service/Menu");
        };
        middleware: {
            FormData: typeof import("./src/middleware/FormData");
        };
    };
    contentController: import("./src/controller/Content");
    schemaController: import("./src/controller/Schema");
    apiController: import("./src/controller/Swagger");
    schemaService: import("./src/service/Schema");
    contentService: import("./src/service/Content");
    sessionService: any;
    configService: import("./src/service/Config");
    languageService: import("./src/service/Language");
    menuService: import("./src/service/Menu");
    authService: any;
    dataService: any;
    logger: any;
    tplService: any;
    cfg: any;
    path: any;
    route: any;
    template: any;
    getRoute(key: string, option: any): string;
    configure(option: any): Document;
    init(app: any, publish?: Function, cfg?: any): {
        cls: {
            module: {
                Document: typeof Document;
            };
            controller: {
                Schema: typeof import("./src/controller/Schema");
                Content: typeof import("./src/controller/Content");
                Swagger: typeof import("./src/controller/Swagger");
            };
            service: {
                Schema: typeof import("./src/service/Schema");
                Content: typeof import("./src/service/Content");
                Session: typeof import("./src/service/Session");
                Language: typeof import("./src/service/Language");
                Config: typeof import("./src/service/Config");
                Menu: typeof import("./src/service/Menu");
            };
            middleware: {
                FormData: typeof import("./src/middleware/FormData");
            };
        };
        contentController: import("./src/controller/Content");
        schemaController: import("./src/controller/Schema");
        apiController: import("./src/controller/Swagger");
        schemaService: import("./src/service/Schema");
        contentService: import("./src/service/Content");
        sessionService: any;
        configService: import("./src/service/Config");
        languageService: import("./src/service/Language");
        menuService: import("./src/service/Menu");
        authService: any;
        dataService: any;
        logger: any;
        tplService: any;
        cfg: any;
        path: any;
        route: any;
        template: any;
        getRoute(key: string, option: any): string;
        configure(option: any): Document;
        init(app: any, publish?: Function, cfg?: any): any;
        setDependencies(options: any): any;
        inject(options: any): any;
        getMissingDependencies(list: string | string[]): string[];
        checkDependencies(list: string | string[], ErrorType?: ErrorConstructor): import("ksdp/types/src/integration/Dip");
    };
    setDependencies(options: any): any;
    inject(options: any): any;
    getMissingDependencies(list: string | string[]): string[];
    checkDependencies(list: string | string[], ErrorType?: ErrorConstructor): import("ksdp/types/src/integration/Dip");
};
export = _exports;
import Document = require("./src/Module");
