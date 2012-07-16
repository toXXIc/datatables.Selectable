/*
 * Selectable is a feature plugin that adds ability to select rows in a datatable.
 *
 * Author:      Basil Gren
 * License:     MIT
 * Version:     1.0.0 (15-Jul-2012)
 */
(function ($) {

    var defaults = {
        iColNumber:1,
        sSelectedRowClass:'selected',
        sIdColumnName: null,
        sControlsClass: 'dataTables_selectionControls',
        bShowControls: true,
        bSingleRowSelect: false,
        bSelectAllCheckbox: false,

        // TODO: Maybe, I18n options should be moved to another place.
        oLanguage: {
            sSelectedRows: 'Selected rows: _COUNT_',
            sClearSelection: 'Clear selection'
        }
    };


    /**
     * Returns an array that contains all keys from specitfied hash.
     * @param hash Hash which keys should be collected into array.
     * @return Array Array that contains all keys of specified hash.
     */
    function getKeys(hash) {
        var keys = [];
        for (var i in hash) if (hash.hasOwnProperty(i))
            keys.push(i);

        return keys;
    }


    /**
     * Object that provides methods to work with selected rows.
     * @param parentSelectable A parent Selectable object.
     */
    function Selection(parentSelectable) {
        // _aoData contains row data objects when sIdColumnName is not set and 
        // contains values of sIdColumnName when it's set.
        this._aoData = [];
        this._oSelectable = parentSelectable;
        this._sIdColumnName = null;
    }


    /**
     * Updates row, assodiated with provided record data or record ID.
     * @param mData Record data or ID 
     */
    Selection.prototype._fnUpdate = function (mData) {
        // Notify oSelectable about data change
        this._oSelectable._fnUpdate(mData);
    };


    /**
     * Returns an array that contains data or record IDs of selected rows.
     * @return Array Array with selected data or record IDs.
     */ 
    Selection.prototype.fnGetData = function () {
        return this._aoData;
    };


    /**
     * Returns total number of selected rows.
     * @return integer Total number of selected rows.
     */
    Selection.prototype.fnGetSize = function () {
        return this._aoData.length;
    };

    
    /**
     * Checks if the row identified by passed row data or row ID is selected.
     * @param mData Row data or record ID.
     * @return True if passed row data or record ID is in the selection.
     */
    Selection.prototype.fnIsSelected = function (mData) {
        if (this._sIdColumnName) {
            if (typeof mData == 'object')
                mData = mData[this._sIdColumnName];
        }
    
        for (var i = 0, count = this._aoData.length; i < count; i++)
            if (this._aoData[i] == mData)
                return true;

        return false;
    };


    /**
     * Adds data to selection and updates appearance of associated row.
     * When options 'sIdColumnName' is set and mData is a row data object, 
     * only value of ID column will be stored in selection.
     * @param mData Data which should be stored in selection array.
     */
    Selection.prototype.fnAdd = function (mData) {
        if (this._oSelectable.options.bSingleRowSelect)
            this.fnClear();

        if (this._sIdColumnName) {
            if (typeof mData == 'object')
                mData = mData[this._sIdColumnName];
        }
            
        this._aoData.push(mData);
        this._fnUpdate(mData);
    };

    /**
     * Removes data from selection and updates appearance of associated row.
     * @param mData Row data or record ID which should be removed from selection.
     */
    Selection.prototype.fnRemove = function (mData) {
        if (this._sIdColumnName) {
            if (typeof mData == 'object')
                mData = mData[this._sIdColumnName];
        }
    
        for (var i = 0, count = this._aoData.length; i < count; i++) {
            if (this._aoData[i] == mData) {
                this._aoData.splice(i, 1);
                this._fnUpdate(mData);
                break;
            }
        }
    };


    /**
     * Clears the selection.
     */
    Selection.prototype.fnClear = function() {
        this._aoData = [];
        this._oSelectable._fnUnselectAll();
    };



// ------------------------------------------------------

    /**
     * Selectable object provides interaction between Selection and DataTable.
     */
    function Selectable(oDTSettings, options) {
        var dTable = oDTSettings.oInstance; // Should be local variable
        this.oTable = dTable;

        this.oDTSettings = oDTSettings;
        this.options = $.extend({}, defaults, options);

        // Add oSelection object to current datatable instance.
        this.oSelection = new Selection(this);
        dTable.oSelection = this.oSelection;
        this.oSelection._sIdColumnName = options.sIdColumnName;

        // Also, store Selectable object in current instance
        dTable._oSelectable = this;

        this.$selectAll = null;

        this.nControls = null;
        this.nCounter = null;
        if (this.options.bShowControls)
        {
            var $controls = $('<div><span class="selection_counter"></span> | </div>');
            $controls.addClass(this.options.sControlsClass);

            var $counter = $controls.find('.selection_counter');
            var $resetLink = $('<a class="selection_clear">' + this.options.oLanguage.sClearSelection + '</a>');
            $resetLink.click(function(evt) {
                dTable.oSelection.fnClear();
            });

            $controls.append($resetLink);

            // Save nodes to Selectable object.
            this.nCounter = $counter[0];
            this.nControls = $controls[0];

            this._fnUpdateCounter();
        }

        this._fnInit();
    }


    /**
     * Initializes plugin.
     */
    Selectable.prototype._fnInit = function () {
        var that = this;

        if (this.options.bSelectAllCheckbox)
        this.oDTSettings.oApi._fnCallbackReg(this.oDTSettings, 'aoInitComplete',
            function() {
                var $cell = $(that.oDTSettings.nTHead).find('tr :nth-child(' + that.options.iColNumber + ')');
                var $selectAll = $('<input type="checkbox" />');
                that.$selectAll = $selectAll;

                $selectAll.groupToggle({
                    groupParent: $(that.oDTSettings.nTBody)
                });

                $cell.html($selectAll);
            }, 'SelectableInitCallback');


        // Register callback that will render checkboxes.
        this.oDTSettings.oApi._fnCallbackReg(this.oDTSettings, 'aoRowCallback',
            this._fnRowCallback, 'SelectableRowCallback');

        this.oDTSettings.oApi._fnCallbackReg(this.oDTSettings, 'aoDrawCallback',
            function(){
                if (that.$selectAll)
                    that.$selectAll.groupToggle('update');
            }, 'SelectableDrawCallback');

        // Redraw the whole table without refiltering and resorting.
        this.oDTSettings.oInstance.fnDraw(false);
    };


    /**
     * Updates row appearance (sets/unsets 'selected' class) and checkbox status
     * depending on passed isSelected parameter.
     * @param $row jQuery object with rows to be updated.
     * @param isSelected True if rows should be rendered as selected, false - as unselected.
     */
    Selectable.prototype._fnSetRowAppearance = function ($row, isSelected) {
        var $check = this._fnGetCheckbox($row);

        if (isSelected) {
            $row.addClass(this.options.sSelectedRowClass);
            $check.attr('checked', 'checked');
        }
        else {
            $row.removeClass(this.options.sSelectedRowClass);
            $check.removeAttr('checked');
        }
    };


    /**
     * Checkbox change handler.
     * @param evt
     */
    Selectable.prototype._onCheckboxChanged = function (evt) {
        var dTable = evt.data;
        var $row = $(this).closest('tr');
        var rowData = dTable.fnGetData($row[0]);

        if ($(this).is(':checked'))
            dTable.oSelection.fnAdd(rowData);
        else
            dTable.oSelection.fnRemove(rowData);
    };


    /**
     * Returns checkbox for the specified row.
     * @param $row jQuery object that contains checkbox.
     */
    Selectable.prototype._fnGetCheckbox = function ($row) {
        return $row.find('td:nth-child(' + this.options.iColNumber + ') input:checkbox');
    };


    /**
     * Updates row class and checkbox state for a row that is linked with provided data.
     * @param data Data object which is linked to a row that should be updated.
     */
    Selectable.prototype._fnUpdate = function (data) {
        // Find row number for data
        // TODO: make sure that this approach will work in any cases.
        var allData = this.oTable.fnGetData();
        var iRow = 0, count, idColName = this.options.sIdColumnName;

        if (idColName)
        {
            // Find index of a row which contains data with provided id ('data' parameter contains ID)
            for (count = allData.length; iRow < count; iRow++)
                if (allData[iRow][idColName] == data)
                    break;
        }
        else
        {
            // Find index of a row which is linked with provided data object ('data' parameter contains row data object)
            for (count = allData.length; iRow < count; iRow++)
                if (allData[iRow] == data)
                    break;
        }

        if (iRow < count) {
            var $row = $(this.oTable.fnGetNodes(iRow));
            this._fnSetRowAppearance($row, this.oSelection.fnIsSelected(data));
        }

        this._fnUpdateCounter();
    };


    /**
     * Updates selection size indicator if selection controls are enabled.
     */
    Selectable.prototype._fnUpdateCounter = function(){
        if (!this.nCounter)
            return;

        this.nCounter.innerHTML = this.options.oLanguage.sSelectedRows.replace('_COUNT_',
                                        this.oSelection.fnGetSize());
    };

    /**
     * Changes appearance of all rows and maked them look like unselected.
     * Method changes only visual state of all rows, but selection remains 
     * the same.
     */
    Selectable.prototype._fnUnselectAll = function() {
        var $rows = this.oTable.$('tr');

        for(var i = 0, count = $rows.length; i < count; i++)
            this._fnSetRowAppearance($($rows[i]), false);

        this._fnUpdateCounter();
    };


    /**
     * Callback that is bound to RowCallback.
     */
    Selectable.prototype._fnRowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        var opts = this._oSelectable.options; // this -> dataTable
        var $row = $(nRow);
        var $cell = $row.find('td:nth-child(' + opts.iColNumber + ')');

        var $check = $cell.find('input:checkbox');
        if ($check.length == 0) {
            $check = $('<input type="checkbox" />');
            $check.change(this, // Custom data - dataTable
                this._oSelectable._onCheckboxChanged);

            $cell.empty().append($check);
            if (this.oSelection.fnIsSelected(aData))
                this._oSelectable._fnSetRowAppearance($row, true);
        }
    };


    // ----------------------------------------------------------------
    //             FEATURE REGISTRATION
    //

    $.fn.dataTableExt.aoFeatures.push({
        fnInit:function (oDTSettings) {

            var options = typeof oDTSettings.oInit.oSelectable != 'undefined' ?
                oDTSettings.oInit.oSelectable : {};

            var selectable = new Selectable(oDTSettings, options);

            return selectable.nControls;
        },

        cFeature:"S",

        sFeature:"Selectable"
    });


})(jQuery);