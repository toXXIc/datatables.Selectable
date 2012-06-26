
describe("DataTables.Selectable (default options)", function() {

    beforeEach(function () {
        initDataTable();
    });


    it('adds oSelection object to dataTable API', function () {
        expect(dTable.oSelection).toBeDefined();
        expect(dTable.oSelection).not.toBe(null);
        expect(typeof dTable.oSelection).toBe('object');
    });
	
	
	it('adds checkboxes to first column', function() {
		var $colCells = findColCells();
		var $checkboxes = findColCheckboxes();
	
		expect($checkboxes.length).toBe($colCells.length);
	});
    
    
    it('keeps selected rows checked after switching to other pages and back', function(){
        var $checkbox = $(findColCheckboxes()[0]);
        
        $checkbox.click();
        dTable.fnPageChange(1);
        dTable.fnPageChange(0);
        
        $checkbox = $(findColCheckboxes()[0]);
        var checked = $checkbox.is(':checked');
        expect(checked).toBe(true);
    });
    
    
    it('sets "selected" class for selected rows', function(){
        var $checkbox = $(findColCheckboxes()[1]);
        
        $checkbox.click();
        
        expect($checkbox.closest('tr').hasClass(SELECTION_CLASS)).toBe(true);
    });

});

// =================================================
// Tests for Selectable plugin options.
// DataTable should be initialized in each test using 
// initDataTable function with custom Selectable options.
describe("DataTables.Selectable (custom options)", function() {
    it('adds checkboxes to any column', function() {
        initDataTable({iColNumber: 2});
        
        var $colCells = findColCells(2);
        var $checkboxes = findColCheckboxes(2);
	
		expect($checkboxes.length).toBe($colCells.length);
    });
});


describe("oSelection", function() {
    var selection = null; // oSelection shortcut

    beforeEach(function () {
        initDataTable();

        selection = dTable.oSelection;
    });


    it('has row data to selection when row checkbox is clicked', function(){
        var $checkbox = $(findColCheckboxes()[0]);
        var $row = $checkbox.closest('tr');

        $checkbox.click();
        expect(selection.fnGetData().length).toBe(1);

        var data = dTable.fnGetData($row[0]);
        expect(selection.fnGetData()[0]).toBe(data);
    });


    it('removes row data from selection when row checkbox is checked and then unchecked', function(){
        var $checkbox = $(findColCheckboxes()[0]);

        $checkbox.click().click();
        expect(selection.fnGetData().length).toBe(0);
    });


    it('method fnAdd adds data to selection', function() {
        var rowData = selectionAdd(2);

        expect(selection.fnGetData()).toEqual([rowData]);
    });

    it('updates row class and checkbox status in method fnAdd()', function() {
        var $row = selectionAddRow(3);
        var $check = getRowCheckbox(3);

        expect($row.hasClass(SELECTION_CLASS)).toBeTruthy();
        expect($check.is(':checked')).toBeTruthy();
    });


    it('updates row class and checkbox status on the other pages using method fnAdd()', function() {
        var data = selectionAdd(13);
        dTable.fnPageChange(1);
        
        //var $row = selectionAddRow(13);
        var $row = getRow(4);

        expect($row).toBeCheckedRow();
    });



    it('removes data from selection using fnRemove()', function() {
        var rowData1 = selectionAdd(2);
        var rowData2 = selectionAdd(4);

        selection.fnRemove(rowData1);

        expect(selection.fnGetData()).toEqual([rowData2]);
    });


    it('updates row class and checkbox status after method fnRemove()', function() {
        var rowData = selectionAdd(4);
        var $row = getRow(4);

        selection.fnRemove(rowData);

        expect($row).toBeUncheckedRow();
    });
});




describe('oSelection (with idColumn)', function() {
    var selection = null; // oSelection shortcut

    beforeEach(function () {
        initDataTable({idColumn: 'id'}, {"aaData": aDataSetWithID});

        selection = dTable.oSelection;
    });



    it('adds only data ID when row data object is passed to fnAdd()', function(){
        var data1 = selectionAdd(3);
        var data2 = selectionAdd(5);
        
        expect(selection.fnGetData()).toEqual([data1.id, data2.id]);
    });


    it('adds data as is when non-object parameter is passed to fnAdd()', function (){
        selection.fnAdd(3);
        selection.fnAdd(6);
        
        expect(selection.fnGetData()).toEqual([3,6]);
    });


    it('updates row appearance after fnAdd()', function() {
        selection.fnAdd(2); // ID = 2, row index = 1
        var $row = getRow(2);

        expect($row).toBeCheckedRow();
    });
    
    
    it('removes ID from selection when row data object is passed to fnRemove()', function(){
        var data1 = selectionAdd(3);
        var data2 = selectionAdd(5);
        
        selection.fnRemove(data1);
        
        expect(selection.fnGetData()).toEqual([data2.id]);
    });


    it('removes ID from selection when non-object parameter is passed to fnAdd()', function (){
        selection.fnAdd(3);
        selection.fnAdd(16);
        
        selection.fnRemove(16);
        
        expect(selection.fnGetData()).toEqual([3]);
    });


    it('updates row appearance after fnRemove()', function() {
        selection.fnAdd(2); // ID = 2, row index = 1
        selection.fnRemove(2);
        var $row = getRow(1);

        expect($row).toBeUncheckedRow();
    });
    
    it('updates row appearance when selected row is on another page', function(){
        selection.fnAdd(15); // Select row which should become visible on page 2
        dTable.fnPageChange(1);
        
        var $row = getRow(5);
        
        expect($row).toBeCheckedRow();
    });
    
    
    
    
});
