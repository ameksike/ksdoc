
const KsDoc = require('../');

describe('Load KsDoc Lib', () => {

    beforeAll(async () => { });

    afterAll(async () => { });

    it("valid instance", () => {
        expect(KsDoc).toBeInstanceOf(Object);
        expect(KsDoc.cls.module.Document).toBeInstanceOf(Function);
        expect(KsDoc.cls.controller.Document).toBeInstanceOf(Function);
        expect(KsDoc.cls.controller.Swagger).toBeInstanceOf(Function);
        expect(KsDoc.cls.service.Content).toBeInstanceOf(Function);
        expect(KsDoc.cls.service.Session).toBeInstanceOf(Function);
    });
});