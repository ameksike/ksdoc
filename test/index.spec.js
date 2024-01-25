
const KsDoc = require('../');

describe('Load KsDoc Lib', () => {

    beforeAll(async () => { });

    afterAll(async () => { });

    it("valid instance", () => {
        expect(KsDoc).toBeInstanceOf(Object);
        expect(KsDoc.driver.Document).toBeInstanceOf(Object);
    });
});