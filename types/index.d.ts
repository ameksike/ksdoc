declare const _exports: {
    cls: {
        module: {
            Document: typeof Document;
        };
        controller: {
            Document: typeof import("./src/controller/Document");
            Swagger: typeof import("./src/controller/Swagger");
        };
        service: {
            Content: typeof import("./src/service/Content");
            Session: typeof import("./src/service/Session");
            Language: typeof import("./src/service/Language");
        };
        middleware: {
            FormData: typeof import("./src/middleware/FormData");
        };
    };
    controller: import("./src/controller/Document");
    apiController: import("./src/controller/Swagger");
    contentService: import("./src/service/Content");
    sessionService: import("./src/service/Session");
    languageService: import("./src/service/Language");
    authService: any;
    dataService: any;
    logger: any;
    tplService: any;
    cfg: any;
    path: any;
    route: any;
    template: any;
    configure(option: any): Document;
    init(app: any, publish?: Function, cfg?: any): {
        cls: {
            module: {
                Document: typeof Document;
            };
            controller: {
                Document: typeof import("./src/controller/Document");
                Swagger: typeof import("./src/controller/Swagger");
            };
            service: {
                Content: typeof import("./src/service/Content");
                Session: typeof import("./src/service/Session");
                Language: typeof import("./src/service/Language");
            };
            middleware: {
                FormData: typeof import("./src/middleware/FormData");
            };
        };
        controller: import("./src/controller/Document");
        apiController: import("./src/controller/Swagger");
        contentService: import("./src/service/Content");
        sessionService: import("./src/service/Session");
        languageService: import("./src/service/Language");
        authService: any;
        dataService: any;
        logger: any;
        tplService: any;
        cfg: any;
        path: any;
        route: any;
        template: any;
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
