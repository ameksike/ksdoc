
/**
 * @template [T=object]
 * @typedef {{[name:String]:T}} TList
 **/

/**
 * @template T
 * @typedef {new (...args: any[]) => T} TCls
 */

// BUILDER

/**
 * @description Dynamically create an instance of a class with variable parameters.
 * @template T
 * @param {TCls<T>} cls - The class constructor.
 * @param {any[]} [args] - An array of arguments to be passed to the class constructor.
 * @returns {T} - An instance of the class.
 */
function build(cls, args = []) {
    return new cls(...args);
}

const TConfig = {
    menu: null,
    session: {
        key: "docs"
    },
    schema: {
        default: ""
    },
    metadata: {
        name: "KsDoc Service",
        description: "description.",
        version: "1.0.0",
        icon: "secure",
        image: "secure",
        group: "Ksike",
        date: "1706135685000"
    }
}

const TConfigAPI = {
    swaggerDefinition: {
        openapi: '3.0.1',
        tags: [],
        info: {
            version: '1.0.0',
            description: 'API Docs'
        },
        basePath: '/',
        servers: [{
            url: "http://{host}:{port}",
            description: "Local development server",
            variables: {
                port: {
                    default: "4000"
                },
                host: {
                    default: "localhost"
                }
            }
        }]
    },
    apis: [
        '{api}/**/*.yml',
        '{api}/**/*.json',
        '{api}/**/*.ts',
        '{api}/**/*.js'
    ],
    js: [],
    css: [],
    topics: [],
}

module.exports = {
    build,
    TConfig,
    TConfigAPI
};