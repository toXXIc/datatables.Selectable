About
-----

Selectable is a DataTables plugin that adds ability to select rows in your DataTable.

Requirements
------------

* jQuery 1.7+
* Datatables 1.9.1+
* jquery.groupToggle plugin (https://github.com/toXXIc/jquery.groupToggle) - required
if Selectable is used with bSelectAllCheckbox = true

Usage
-----

Selectable is a feature plugin, so it can be enabled by adding 'S' character to 
datatables `sDom` option. Plugin options can be specified in `oSelectable` option:

```js
var dTable = $('#mytable').dataTable({
    sDom: 'lfrtipS',
    oSelectable: {
        iColNumber:1,
        sIdColumnName: 'id',
        bShowControls: true
    }
});
```

After initialization Selectable plugin adds oSelection object to the datatable. 
This object can be used to retrieve and manipulate selection:
```js
// Get selection object
var selection = dTable.oSelection;

// Get total number of selected rows
var selCount = selection.fnGetSize();

// Add record with ID = 12 to selection
selection.fnAdd(12);

// Get all selected record IDs
var ids = selection.getIds();
```

You can see the demo in examples.html.

Plugin options
--------------

All options are optional.

`iColNumber` *Default: `1`.*
    Number of a column that will contain row selection checkboxes.

`sIdColumnName` *Default: `null`.*
    The name of row column that contains unique record ID. This parameter is required 
    if datatable uses server-side data.

`bShowControls` *Default: `true`*. 
    Selection controls will be shown if this option is set to true.

`bSingleRowSelect` *Default: `false`*.
    Only single row can be selected when this option is set to true.

`bSelectAllCheckbox` *Default: `false`*
    Adds a checkbox to column header, which will select/deselect all 
    rows on the current page of the table. This option requires 
    [jquery.groupToggle](https://github.com/toXXIc/jquery.groupToggle) plugin.

`sSelectionTrigger` *Default: `'checkbox'`*.
    Determines an area which should be clicked to select a row.
    Available options: 
      *  `'checkbox'` - a row will be selected only when selection checkbox is clicked.
      *  `'cell'` - a row will be selected when user clicks on a cell that contains selection checkbox.
      *  `'row'` - a row is selected when user clicks on any cell of the row.
    

`sSelectedRowClass` *Default: `'selected'`.*
    A class that will be added to every selected row.

`sControlsClass` *Default: `'dataTables_selectionControls'`.*
    A class name of the html element that contains all selection controls.


Internationalization
--------------------

Text of selection controls can be changed by specifying `oLanguage` option for Selectable.

```js
var dTable = $('#mytable').dataTable({
    sDom: 'lfrtipS',
    oSelectable: {
        oLanguage: {
            // Text for selection size counter. _COUNT_ placeholder will be 
            // replaced by total number of selected rows.
            sSelectedRows: 'Selected rows: _COUNT_', 
        
            // Text for 'Clear selection' link
            sClearSelection: 'Clear selection'       
        }
    }
});
```


oSelection methods
------------------

## Test

### Test

#### Test

##### Test 

    /**
     * Returns an array that contains data of selected rows.
     * When sIdColumnName is specified, this method returns null.
     * @return Array Array with selected data.
     */ 
    Selection.prototype.fnGetData = function () {
    };


    /**
     * Returns an array that contains record IDs of selected rows.
     * This method returns null when sIdColumnName is NOT specified.
     * @return Array Array with selected record IDs.
     */
    Selection.prototype.fnGetIds = function () {
    };


    /**
     * Returns total number of selected rows.
     * @return integer Total number of selected rows.
     */
    Selection.prototype.fnGetSize = function () {
    };

    
    /**
     * Checks if the row identified by passed row data or row ID is selected.
     * @param mData Row data or record ID.
     * @return True if passed row data or record ID is in the selection.
     */
    Selection.prototype.fnIsSelected = function (mData) {
    };


    /**
     * Adds data to selection and updates appearance of associated row.
     * When options 'sIdColumnName' is set and mData is a row data object, 
     * only value of ID column will be stored in selection.
     * @param mData Data which should be stored in selection array.
     */
    Selection.prototype.fnAdd = function (mData) {
    };


    /**
     * Removes data from selection and updates appearance of associated row.
     * @param mData Row data or record ID which should be removed from selection.
     */
    Selection.prototype.fnRemove = function (mData) {
    };


    /**
     * Clears the selection.
     */
    Selection.prototype.fnClear()

