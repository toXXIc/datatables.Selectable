About
=====

TODO: complete doc.

Selectable is a DataTables plugin that adds ability to select rows in your DataTable.

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

You can see the demo in examples.html.

Plugin options
--------------

`iColNumber`
*Optional. Default: `1`.*
The number of a column that will contain rows checkboxes.


`sSelectedRowClass`
*Optional. Default: `'selected'`.*
A class that will be added to a selected row.


`sIdColumnName`
*Optional. Default: `null`.*
The name of a column that contains record ID. This parameter is required 
if datatable use server-side data.


`sControlsClass`
*Optional. Default: `'dataTables_selectionControls'`.*
A class name of the html element that contains all selection controls.

`bShowControls`
*Optional. Default: `true`.*
Specifies if selection controls should be shown.
