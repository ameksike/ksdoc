class PluginService {

    /**
     * @description load PluginService content
     * @param {Object} [option]
     * @param {String} [option.path]
     * @param {Object} [option.paths]
     * @param {String} [option.idiom]
     * @param {String} [option.schema]
     * @param {String} [option.extension]
     * @param {String} [option.filename]
     * @returns {Promise<Object>}
     */
    load(option) {
        let { path, idiom = "en", extension, schema, filename, paths } = option || {};
        path = path || utl.mix(paths?.lang, { ...paths, schema });
        filename = filename || (idiom || this.default) + "." + (extension || this.extension);
        let file = schema === "ksdoc" ? _path.join(__dirname, "../../doc/lang", filename) : _path.join(path, filename);
        return utl.fileRead(file);
    }
}

module.exports = PluginService;