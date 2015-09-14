About
-----

Selectable is a DataTables plugin that adds ability to select rows in your DataTable.

**NOTE: The plugin is no longer maintained, sorry. Please consider using fully-featured DataTable [Select extension](http://datatables.net/extensions/select/) instead.**

Requirements
------------

* jQuery 1.7+
* Datatables 1.9.1+
* jquery.groupToggle plugin (https://github.com/toXXIc/jquery.groupToggle) - required
if Selectable is used with bSelectAllCheckbox = true

Usage
-----

Selectable is a feature plugin, so it can be enabled by adding 'L' character to
datatable `sDom` option. Plugin options can be specified in `oSelectable` option:

```js
var dTable = $('#mytable').dataTable({
    sDom: 'lfrtipL',
    oSelectable: {
        iColNumber:1,
        sIdColumnName: 'id',
        bShowControls: true,

        fnSelectionChanged: function(selection) {
            if (selection.fnGetSize() > 0)
                doSomething();
        }
    }
});
```

After initialization Selectable plugin adds fnGetSelection() function to the datatable. 
This function returns selection object that can be used to manipulate selection:

```js
// Get selection object
var selection = dTable.fnGetSelection();

// Get total number of selected rows
var selCount = selection.fnGetSize();

// Add record with ID = 12 to the selection
selection.fnAdd(12);

// Get all selected record IDs
var ids = selection.getIds();
```

You can see the demo in examples.html.


Plugin options
--------------

`iColNumber` *Default: 1.*
    Number of a column that will contain row selection checkboxes.

`sIdColumnName` *Default: null.*
    The name of row column that contains unique record ID. This parameter is required 
    if datatable uses server-side data.

`bShowControls` *Default: true*. 
    Selection controls will be shown if this option is set to true.

`bSingleRowSelect` *Default: false*.
    Only single row can be selected when this option is set to true.

`bSelectAllCheckbox` *Default: false*
    Adds a checkbox to column header, which will select/deselect all 
    rows on the current page of the table. When this option is set to true,
    Selectable uses [jquery.groupToggle](https://github.com/toXXIc/jquery.groupToggle) 
    plugin, so make sure it's loaded.

`sSelectionTrigger` *Default: 'checkbox'.*
    Determines an area which should be clicked to select a row.
    Available options:
 
*  _'checkbox'_ - a row will be selected only when selection checkbox is clicked.
*  _'cell'_ - a row will be selected when user clicks on a cell that contains selection checkbox.
*  _'row'_ - a row is selected when user clicks on any cell of the row.

`fnSelectionChanged` *Default: null.*
    A callback function that will be called every time selection is changed. Callback receives one parameter -
    selection object.


`sSelectedRowClass` *Default: 'selected'.*
    A class that will be added to &lt;tr&gt; element of every selected row.

`sControlsClass` *Default: 'dataTables_selectionControls'.*
    A style class for the html element that contains all selection controls.


Internationalization
--------------------

Text of selection controls can be changed by specifying `oLanguage` option for Selectable.

```js
var dTable = $('#mytable').dataTable({
    sDom: 'lfrtipL',
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


### fnAdd(mData)
Adds a row to selection and updates its appearance. Record ID may be passed
only when option 'sIdColumnName' is sepecified.

**Parameters:**
* `mData` Row data or record ID that identifies a row which should be selected.


### fnClear()
Clears the selection.


### fnGetData()
Returns an array that contains data of selected rows.
This method returns null, when `sIdColumnName` is specified.

**Returns:** Array with selected rows data or null if `sIdColumnName` option is set.


### fnGetIds()
Returns an array that contains record IDs of selected rows.
This method returns null when `sIdColumnName` is NOT specified.


### fnGetSize()
Returns total number of selected rows.
    

### fnIsSelected(mData) 
Checks if the row identified by passed row data or record ID is selected.
Record ID may be specified only when `sIdColumnName` option is specified.

**Parameters:**
* `mData` Row data or record ID.

**Returns:** True if a row identified by passed row data or record ID is selected.
       

### fnRemove(mData)
Removes data from selection and updates appearance of associated row.

**Parameters:** 
* `mData` Row data or record ID that identifies a row which should be removed from selection.



License
-------

This code is free to use under the terms of the MIT license.
