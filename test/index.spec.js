
const KsDoc = require('../');

describe('Load KsDoc Lib', () => {

    beforeAll(async () => { });

    afterAll(async () => { });

    it("valid instance", () => {
        expect(KsDoc).toBeInstanceOf(Object);
        expect(KsDoc.cls.module.Document).toBeInstanceOf(Function);
        expect(KsDoc.cls.controller.Content).toBeInstanceOf(Function);
        expect(KsDoc.cls.controller.Schema).toBeInstanceOf(Function);
        expect(KsDoc.cls.controller.Swagger).toBeInstanceOf(Function);
        expect(KsDoc.cls.service.Schema).toBeInstanceOf(Function);
        expect(KsDoc.cls.service.Content).toBeInstanceOf(Function);
        expect(KsDoc.cls.service.Session).toBeInstanceOf(Function);
        expect(KsDoc.cls.service.Language).toBeInstanceOf(Function);
        expect(KsDoc.cls.service.Config).toBeInstanceOf(Function);
        expect(KsDoc.cls.service.Menu).toBeInstanceOf(Function);
        expect(KsDoc.cls.middleware.FormData).toBeInstanceOf(Object);
    });
});