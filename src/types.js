
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

const config = {
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
        './**/*.yml',
        './**/*.json',
        './**/*.ts',
        './**/*.js'
    ],
    js: [],
    css: [],
    topics: []
}

module.exports = {
    build,
    config
};