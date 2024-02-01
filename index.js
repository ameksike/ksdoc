const Document = require('./src/Module');

module.exports = new (class extends Document {
    cls = {
        module: {
            Document
        },
        controller: {
            Document: require('./src/controller/Document'),
            Swagger: require('./src/controller/Swagger'),
        },
        service: {
            Content: require('./src/service/Content'),
            Session: require('./src/service/Session'),
            Language: require('./src/service/Language'),
            Config: require('./src/service/Config'),
            Menu: require('./src/service/Menu'),
        },
        middleware: {
            FormData: require('./src/middleware/FormData'),
        }
    };
});