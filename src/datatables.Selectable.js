/*
 * Selectable is a feature plugin for DataTables that provides ability to select rows.
 *
 * Author:      Basil Gren
 * License:     MIT
 * Version:     1.0.2 (25-Jul-2012)
 */
(function ($) {

    var defaults = {
        iColNumber:         1,          // Number of columns that will contain selection checkboxes.
        sIdColumnName:      null,       // Name of column that contains unique record ID.
        bShowControls:      true,       // Determines if selection controls (size etc) will be shown
        bSingleRowSelect:   false,      // Set to true if only one row at a time can be selected
        bSelectAllCheckbox: false,      // When true, a checkbox will be rendered in column header,
                                          // which will select/deselect all rows on current page
        sSelectionTrigger:     'checkbox', // Determines an area which should be clicked to select a row.
                                          // Available options: 'checkbox', 'cell', 'row'

        fnSelectionChanged: null,       // Called every time selection is changed

        // Classes customization
        sSelectedRowClass:'selected',   // A class which will be added to <tr> element of selected rows.
        sControlsClass: 'dataTables_selectionControls', // Default class for selection controls.

        // I18n options
        oLanguage: {
            sSelectedRows: 'Selected rows: _COUNT_', // Text for selection size counter
            sClearSelection: 'Clear selection'       // Text for 'Clear selection' link
        }
    };


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
     * Updates row, associated with provided record data or record ID.
     * @param mData Record data or ID 
     */
    Selection.prototype._fnUpdate = function (mData) {
        // Notify oSelectable about data change
        this._oSelectable._fnUpdate(mData);
    };


    /**
     * Returns an array that contains data of selected rows.
     * When sIdColumnName is specified, this method returns null.
     * @return Array Array with selected data.
     */ 
    Selection.prototype.fnGetData = function () {
        if (this._sIdColumnName)
            return null;

        return this._aoData;
    };


    /**
     * Returns an array that contains record IDs of selected rows.
     * This method returns null when sIdColumnName is NOT specified.
     * @return Array Array with selected record IDs.
     */
    Selection.prototype.fnGetIds = function () {
        if (this._sIdColumnName)
            return this._aoData;

        return null;
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

        this._oSelectable._fnSelectionChanged();
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

                this._oSelectable._fnSelectionChanged();
                break;
            }
        }
    };


    /**
     * Clears the selection.
     */
    Selection.prototype.fnClear = function() {
        if (this._aoData.length == 0)
            return;

        this._aoData = [];
        this._oSelectable._fnUnselectAll();

        this._oSelectable._fnSelectionChanged();
    };



// ------------------------------------------------------

    /**
     * Selectable object provides interaction between Selection and DataTable.
     */
    function Selectable(oDTSettings, options) {
        
        this.options = $.extend({}, defaults, options);

        this.oTable = oDTSettings.oInstance;
        
        // Add oSelection object to current datatable instance.
        this.oSelection = new Selection(this);
        
        this.oDTSettings = oDTSettings;
        oDTSettings.oSelection = this.oSelection;

        this.oSelection._sIdColumnName = options.sIdColumnName;

        // Also, store Selectable object in current instance
        oDTSettings._oSelectable = this;

        this.$selectAll = null;

        this.nControls = null;
        this.nCounter = null;
        if (this.options.bShowControls)
        {
            var $controls = $('<div><span class="selection_counter"></span> | </div>');
            $controls.addClass(this.options.sControlsClass);

            var $counter = $controls.find('.selection_counter');
            var $resetLink = $('<a class="selection_clear">' + this.options.oLanguage.sClearSelection + '</a>');
            $resetLink.on('click', function() {
                oDTSettings.oSelection.fnClear();
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

        this._massChange = false;

        if (this.options.bSelectAllCheckbox && !this.options.bSingleRowSelect)
        this.oDTSettings.oApi._fnCallbackReg(this.oDTSettings, 'aoInitComplete',
            function() {
                var $cell = $(that.oDTSettings.nTHead).find('tr :nth-child(' + that.options.iColNumber + ')');
                var $selectAll = $('<input type="checkbox" />');
                that.$selectAll = $selectAll;

                $selectAll.groupToggle({
                    groupParent: $(that.oDTSettings.nTBody),

                    onBeforeChange: function() {
                        that._massChange = true; // Set mass change flag to ignore multiple update events.
                    },
                    onChanged: function() {
                        that._massChange = false;

                        that._fnSelectionChanged();
                    }
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
            dTable.fnGetSelection().fnAdd(rowData);
        else
            dTable.fnGetSelection().fnRemove(rowData);
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
    Selectable.prototype._fnRowCallback = function (nRow, aData) {
        var selectable = this.fnSettings()._oSelectable;
        var opts = selectable.options; // this -> dataTable
        var $row = $(nRow);
        var $cell = $row.find('td:nth-child(' + opts.iColNumber + ')');

        var $check = $cell.find('input:checkbox');
        if ($check.length != 0)
            return;

        // Create checkbox and bind handler
        $check = $('<input type="checkbox" />');
        $check.on('change',
                  this, // Custom data - this points to DataTable object
                  selectable._onCheckboxChanged);

        // Now check sSelectionTrigger and bind additional handlers if necessary.
        var $trigger = null;
        if (opts.sSelectionTrigger == 'cell')
            $trigger = $cell;
        else if (opts.sSelectionTrigger == 'row')
            $trigger = $row;

        if ($trigger) {
            $check.on('click', function(evt){
                // Stop event bubbling as it will cause infinite loop in $trigger click handler,
                // when we imitate click on the checkbox ($checkbox.click()).
                evt.stopPropagation();
            });

            // Performance??? Consider replacing by .on handler, bound to tbody.
            $trigger.on('click', function() {
                // Click checkbox to toggle it.
                $check.click();
            });
        }

        $cell.empty().append($check);
        if (this.fnGetSelection().fnIsSelected(aData))
            selectable._fnSetRowAppearance($row, true);
    };


    Selectable.prototype._fnSelectionChanged = function() {
        if (this._massChange)
            return;

        if (typeof this.options.fnSelectionChanged == 'function')
            this.options.fnSelectionChanged(this.oSelection);
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

        cFeature: "L",

        sFeature: "Selectable"
    });
    
    
    // Register API function that will return selection object.
    $.fn.dataTableExt.oApi.fnGetSelection = function (oSettings) {
        return oSettings.oSelection;
    };


})(jQuery);