/*
 * Inputs:      object:oSettings - dataTables settings object - automatically given
 *              oOptions - additional options to customize plugin behavior
 *
 * Usage:       $('#example').dataTable().fnSelectable(options);
 * Author:      Basil Gren
 * License:     GPL v2 or BSD 3 point style
 */
(function($){

$.fn.dataTableExt.oApi.fnSelectable = function (oSettings, oOptions){

    var defaults = {
        selected: [], // Array of selected IDs.
        idParamName: 'id', // Parameter name that stores unique row ID in row data.
        selectedRowClass: 'row-selected',
        checkboxSelect: false,
        checkboxSelectClass: 'sel_row',
        onRowSelectionChange: null
    };


    var _table = this;


    // this points to jQuery element.
    this.each(function (i) {
        $.fn.dataTableExt.iApiIndex = i;

        $.data(this, 'dateTable_selection', new DataTableSelection(_table, oSettings, oOptions));

        //oSettings.oSelection = new DataTableSelection(oSettings, oOptions)

        return this;
    });




    // ---------------- IMPLEMENTATION --------------------

    function DataTableSelection(dataTable, oSettings, options)
    {
        var oSelection = this;

        options = $.extend({}, defaults, options);

        oSettings.oApi._fnCallbackReg(oSettings, 'aoRowCreatedCallback', onRowCreated, 'bind_new_row_handlers');


        this.dataTable = dataTable;
        this.getSelected = function () {
            return options.selected;
        };


        return this;

        /**
         * Returns record id
         * @param rowElemOrID tr DOM element or id which is specified in row data
         * @return Record identifier or null if it's cannot be found.
         */
        function getRecordID(rowElemOrID)
        {
            if (typeof rowElemOrID != 'object')
                return rowElemOrID;

            var data = dataTable.fnGetData(rowElemOrID);

            // Check if row data contains row identifier.
            if (data.hasOwnProperty(options.idParamName))
                return data[options.idParamName];

            return null;
        }


        // Sets selected state for specified row id
        function setSelected(nRow, state)
        {
            var recID = getRecordID(nRow);

            var index = options.selected.indexOf(recID);
            if (state)
            {
                if (index < 0)
                {
                    options.selected.push(recID);
                    fireRowSelectionChange(nRow);
                }
            }
            else
            {
                if (index >= 0)
                {
                    options.selected.splice(index, 1);
                    fireRowSelectionChange(nRow);
                }
            }
        }



        function fireRowSelectionChange(nRow)
        {
            if (typeof options.onRowSelectionChange == 'function')
            {
                options.onRowSelectionChange.apply(oSelection, arguments);
            }
        }


        function getRowCheckbox(rowElem)
        {
            return $(rowElem).find('input[type="checkbox"].' + options.checkboxSelectClass);
        }

        function isSelected(rowElemOrRecordID)
        {
            var recID = getRecordID(rowElemOrRecordID);
            return (options.selected.indexOf(recID) >= 0);
        }


        function updateRowAppearance(rowElem)
        {
            var selected = isSelected(rowElem);
            if (selected)
                $(rowElem).addClass(options.selectedRowClass);
            else
                $(rowElem).removeClass(options.selectedRowClass);


            if (options.checkboxSelect)
            {
                var $check = getRowCheckbox(rowElem);
                if ($check.length > 0)
                    $check[0].checked = selected;
            }
        }


        function onRowCheckboxChange(evt) {
            var $chkRow = $(this).closest('tr');
            if (!$chkRow.length)
                return;

            var rowElem = $chkRow[0];

            setSelected(rowElem, this.checked);
            updateRowAppearance(rowElem);
        }



        function onRowClick(evt) {
            var recID = getRecordID(this);
            setSelected(this, !isSelected(recID));
            updateRowAppearance(this);
        }


        // Handler that will be added to fnCreatedRow
        function onRowCreated(nRow, aData, iDataIndex) {
            var $row = $(nRow);

            // Register handlers.
            if (options.checkboxSelect)
            {
                var $check = getRowCheckbox(nRow);
                $check.change(onRowCheckboxChange);
            }
            else
            {
                // On Click handler
                $row.click(onRowClick);
            }


            updateRowAppearance(nRow);
        }

    }


    return this;

}; // fnSelectable extension
})(jQuery);

