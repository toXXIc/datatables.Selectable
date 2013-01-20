
describe("DataTables.Selectable (default options)", function() {

    beforeEach(function () {
        initDataTable();
    });


    it('adds oSelection object to dataTable API', function () {
        var selection = dTable.fnGetSelection();
        expect(selection).toBeDefined();
        expect(selection).not.toBe(null);
        expect(typeof selection).toBe('object');
    });

    it('returns dataTable with oSelection after calling dataTable()', function(){
        var dt = $table.dataTable();

        expect(typeof dt.fnGetSelection()).toBe('object');
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


    it('shows selection controls by default', function() {
        var $controls = $('.dataTables_selectionControls');

        expect($controls.length).toBe(1);
    });


    it('updates selection counter when selection changes', function(){
        selectionAdd(2);
        selectionAdd(4);

        var text = dTable.fnSettings()._oSelectable.nCounter.innerHTML;

        expect(text).toEqual("Selected rows: 2");
    });


    it('clears selection when Clear Selection link is clicked', function(){
        selectionAdd(2);
        selectionAdd(4);

        $(dTable.fnSettings()._oSelectable.nControls).find('a.selection_clear').click();

        expect(dTable.fnGetSelection().fnGetSize()).toBe(0);
    });


});

// =================================================
// Tests for Selectable plugin options.
// DataTable should be initialized in each test using 
// initDataTable function with custom Selectable options.
describe("DataTables.Selectable (custom options)", function() {

    var callbackStubs = {
        fnSelectionChanged: function(selection) {
            selection.fnGetSize();
        }
    };


    it('adds checkboxes to any column', function() {
        initDataTable({iColNumber: 2});
        
        var $colCells = findColCells(2);
        var $checkboxes = findColCheckboxes(2);
	
		expect($checkboxes.length).toBe($colCells.length);
    });


    it("doesn't show selection controls when bShowControls = false", function(){
        initDataTable({bShowControls: false});

        var $controls = $('.dataTables_selectionControls');

        expect($controls.length).toBe(0);
    });


    it("supports i18n for 'Selected rows' text and 'Clear selection' link", function() {
        initDataTable({oLanguage: {
                sSelectedRows: 'Выбрано строк: _COUNT_',
                sClearSelection: 'Очистить выделение'
            }
        });

        selectionAdd(2);

        var $controls = $('.dataTables_selectionControls');
        var $link = $controls.find('a.selection_clear');
        var $counter = $controls.find('.selection_counter');

        expect($link.text()).toBe('Очистить выделение');
        expect($counter.text()).toBe('Выбрано строк: 1');
    });


    it('selects only one row when bSingleRowSelect is true', function(){
        initDataTable({bSingleRowSelect: true, sIdColumnName:'id'}, {aaData: aDataSetWithID});

        selectionAdd(2);  // Row index 2 - ID = 3
        selectionAdd(4);  // Row index 4 - ID = 5

        var selected = dTable.fnGetSelection().fnGetIds();
        expect(selected).toEqual([5]);
    });


    it('shows Select All checkbox in header when bSelectAllCheckbox is set.', function() {
        initDataTable({bSelectAllCheckbox: true});
        var $input = getSelectAllCheckbox();

        expect($input.length).toBe(1);
    });

    it('selects all rows on a page when Select All checkbox is clicked', function (){
        initDataTable({bSelectAllCheckbox: true});
        var $selectAll = getSelectAllCheckbox();
        $selectAll.click();

        var $checkboxes = findColCheckboxes();
        var $checked = $checkboxes.filter(':checked');

        expect($checked.length).toBe($checkboxes.length);
    });


    it('unchecks Select All checkbox when one row is deselected after all rows are selected', function (){
        initDataTable({bSelectAllCheckbox: true});
        var $selectAll = getSelectAllCheckbox();
        $selectAll.click();

        var $checkboxes = findColCheckboxes();
        $($checkboxes[1]).click();

        expect($selectAll.is(':checked')).toBe(false);
    });


    it('does not change the state of other checkboxes when Select All is clicked', function(){
        initDataTable({bSelectAllCheckbox: true});

        var $customCheckboxes = $table.find('tbody td:nth-child(5) input:checkbox');
        var $check1 = $($customCheckboxes[0]), $check2 = $($customCheckboxes[1]);

        var state1 = $check1.is(':checked');
        var state2 = $check2.is(':checked');
        
        var $selectAll = getSelectAllCheckbox();
        $selectAll.click();

        expect($check1.is(':checked')).toBe(state1);
        expect($check2.is(':checked')).toBe(state2);

        // Now clear the selection.
        $selectAll.click();
        expect($check1.is(':checked')).toBe(state1);
        expect($check2.is(':checked')).toBe(state2);
    });



    it('selects a row after click on a cell containing selection checkbox when sSelectionTrigger = "cell"', function(){
        initDataTable({sSelectionTrigger: 'cell', sIdColumnName:'id'}, {aaData: aDataSetWithID});

        var $checkboxes = findColCheckboxes();
        var $cell = $($checkboxes[1]).closest('td');
        $cell.click();

        var selected = dTable.fnGetSelection().fnGetIds();
        expect(selected).toEqual([2]);
    });


    it('selects a row after click on any cell of the row when sSelectionTrigger = "row"', function(){
        initDataTable({sSelectionTrigger: 'row', sIdColumnName:'id'}, {aaData: aDataSetWithID});

        var $checkboxes = findColCheckboxes();
        var $row = $($checkboxes[1]).closest('tr');
        $row.find('td:nth-child(3)').click();

        var selected = dTable.fnGetSelection().fnGetIds();
        expect(selected).toEqual([2]);
    });


    it('calls fnSelectionChanged callback after selection is changed', function(){
        spyOn(callbackStubs, 'fnSelectionChanged');

        initDataTable({sSelectionTrigger: 'row', sIdColumnName:'id',
                       fnSelectionChanged: callbackStubs.fnSelectionChanged},
                      {aaData: aDataSetWithID});

        var $checkboxes = findColCheckboxes();
        var $cell = $($checkboxes[1]).closest('td');
        $cell.click().click();  // Select and deselect row

        expect(callbackStubs.fnSelectionChanged).toHaveBeenCalledWith(dTable.fnGetSelection());
        expect(callbackStubs.fnSelectionChanged.calls.length).toEqual(2);
    });


    it('calls fnSelectionChanged callback after fnClear', function(){
        spyOn(callbackStubs, 'fnSelectionChanged');

        initDataTable({sSelectionTrigger: 'row', sIdColumnName:'id',
                        fnSelectionChanged: callbackStubs.fnSelectionChanged},
                        {aaData: aDataSetWithID});

        // Firstly call fnClear when nothing is selected.
        dTable.fnGetSelection().fnClear(); // Callback shouldn't be called.
        selectionAddRow(2); // Callback should be called
        dTable.fnGetSelection().fnClear(); // And here callback should be called.

        expect(callbackStubs.fnSelectionChanged.calls.length).toEqual(2);
    });


    it('calls fnSelectionChanged once after Select All checkbox is clicked.', function(){
        spyOn(callbackStubs, 'fnSelectionChanged');

        initDataTable({sSelectionTrigger: 'row', sIdColumnName:'id',
                fnSelectionChanged: callbackStubs.fnSelectionChanged, bSelectAllCheckbox: true},
            {aaData: aDataSetWithID});

        var $selectAll = getSelectAllCheckbox();
        $selectAll.click().click();

        expect(callbackStubs.fnSelectionChanged.calls.length).toEqual(2);
    });



});


describe("oSelection", function() {
    var selection = null; // oSelection shortcut

    beforeEach(function () {
        initDataTable();

        selection = dTable.fnGetSelection();
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




describe('oSelection (with sIdColumnName)', function() {
    var selection = null; // oSelection shortcut

    beforeEach(function () {
        initDataTable({sIdColumnName: 'id'}, {"aaData": aDataSetWithID});

        selection = dTable.fnGetSelection();
    });



    it('adds only data ID when row data object is passed to fnAdd()', function(){
        var data1 = selectionAdd(3);
        var data2 = selectionAdd(5);
        
        expect(selection.fnGetIds()).toEqual([data1.id, data2.id]);
    });


    it('adds data as is when non-object parameter is passed to fnAdd()', function (){
        selection.fnAdd(3);
        selection.fnAdd(6);
        
        expect(selection.fnGetIds()).toEqual([3,6]);
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
        
        expect(selection.fnGetIds()).toEqual([data2.id]);
    });


    it('removes ID from selection when non-object parameter is passed to fnAdd()', function (){
        selection.fnAdd(3);
        selection.fnAdd(16);
        
        selection.fnRemove(16);
        
        expect(selection.fnGetIds()).toEqual([3]);
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
