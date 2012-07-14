
describe("DataTables.Selectable (server data with ID column)", function() {
    var loadingData = false;

    beforeEach(function () {

        initRemoteDataTable({idColumn: 'id'},
            {
                // It seems that sometimes fnDrawCallback is called before selected checkbox appearance is updated
                // so it causes false negative in async test. After small delay is added, everything is ok.
                // TODO: figure out why it is happening.
                fnPreDrawCallback: function(){
                    loadingData = true;
                },
                fnDrawCallback: function( oSettings ) {
                    setTimeout(function() {
                        loadingData = false;
                    }, 150);
                }
            }
        );

        waitDataLoaded(); // Ensure that data are loaded after previous request.
    });


    function asyncPageChange(page) {
        runs(function(){
            loadingData = true;
            dTable.fnPageChange(page);
        });
        waitDataLoaded();
    }


    /**
     * Ensures that data are loaded and rows are rendered.
     */
    function waitDataLoaded(){
        waitsFor(function(){
            return !loadingData && (findColCheckboxes().length > 0);
        }, "The page should be rendered.", 500);
    }



    it('adds oSelection object to dataTable API', function() {
        runs(function(){
            expect(dTable.oSelection).toBeDefined();
            expect(dTable.oSelection).not.toBe(null);
            expect(typeof dTable.oSelection).toBe('object');
        });
    });


    function logLoadingState(s){
        console.log(s + ' - ' + (loadingData ? 'loading' : 'data loaded'));
    }

    it('preserves row selected changing page and returning back', function() {
        var $checkbox;

        runs(function(){
            $checkbox = $(findColCheckboxes()[0]);
            $checkbox.click();
        });

        asyncPageChange(1);
        asyncPageChange(0);

        runs(function(){
            var $row = getRow(1);
            expect($row).toBeCheckedRow();
        });
    });

});
