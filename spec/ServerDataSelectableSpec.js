
describe("DataTables.Selectable (server data)", function() {

    beforeEach(function () {
        initRemoteDataTable();
    });
    
    it('adds oSelection object to dataTable API', function () {
        expect(dTable.oSelection).toBeDefined();
        expect(dTable.oSelection).not.toBe(null);
        expect(typeof dTable.oSelection).toBe('object');
    });

});
