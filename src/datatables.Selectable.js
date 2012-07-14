(function ($) {

    var defaults = {
        iColNumber:1,
        sSelectedRowClass:'selected',
        idColumn: null
    };

    function getKeys(hash) {
        var keys = [];
        for (var i in hash) if (hash.hasOwnProperty(i))
            keys.push(i);

        return keys;
    }


    function Selection(parentSelectable) {
        // _aoData contains row data objects when idColumn is not set and 
        // contains values of idColumn when it's set.
        this._aoData = [];
        this._oSelectable = parentSelectable;
        this._idColumn = null;
    }

    Selection.prototype._fnUpdate = function (oData) {
        // Notify oSelectable about data change
        this._oSelectable._fnUpdate(oData);
    };


// Use this method to get selected data.
    Selection.prototype.fnGetData = function () {
        return this._aoData;
    };

    
    Selection.prototype.fnIsSelected = function (mData) {
        if (this._idColumn) {
            if (typeof mData == 'object')
                mData = mData[this._idColumn];
        }
    
        for (var i = 0, count = this._aoData.length; i < count; i++)
            if (this._aoData[i] == mData)
                return true;

        return false;
    };


    /**
     * Adds data to selection and updates appearance of representing row.
     * @param mData Data which should be stored in selection array.
     *              When idColumn is set and mData is a row data object,
     *              only value of ID column is stored.
     */
    Selection.prototype.fnAdd = function (mData) {
        if (this._idColumn) {
            if (typeof mData == 'object')
                mData = mData[this._idColumn];
        }
            
        this._aoData.push(mData);
        this._fnUpdate(mData);
    };


    Selection.prototype.fnRemove = function (mData) {
        if (this._idColumn) {
            if (typeof mData == 'object')
                mData = mData[this._idColumn];
        }
    
        for (var i = 0, count = this._aoData.length; i < count; i++)
            if (this._aoData[i] == mData) {
                this._aoData.splice(i, 1);
                this._fnUpdate(mData);
                break;
            }
    };


// ------------------------------------------------------


    function Selectable(oDTSettings, options) {

        this.oDTSettings = oDTSettings;
        this.options = $.extend({}, defaults, options);

        var $elem = $('<span>Selectable</span>');
        this.oTable = oDTSettings.oInstance;


        // Add oSelection object to current datatable instance.
        this.oSelection = new Selection(this);
        this.oTable.oSelection = this.oSelection;
        this.oSelection._idColumn = options.idColumn;

        // Also, store Selectable object in current instance
        this.oTable._oSelectable = this;

        this._fnInit();
    }


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
        var iRow = 0, count, idColName = this.options.idColumn;

        if (idColName)
        {
            for (count = allData.length; iRow < count; iRow++)
                if (allData[iRow][idColName] == data)
                    break;
        }
        else
        {
            for (count = allData.length; iRow < count; iRow++)
                if (allData[iRow] == data)
                    break;
        }

        if (iRow < count) {
            var $row = $(this.oTable.fnGetNodes(iRow));
            this._fnSetRowAppearance($row, this.oSelection.fnIsSelected(data));
        }
    };


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
            //    $check.attr('checked', 'checked');
        }
    };


    Selectable.prototype._fnInit = function () {
        // Register callback that will render checkboxes.
        this.oDTSettings.oApi._fnCallbackReg(this.oDTSettings, 'aoRowCallback',
            this._fnRowCallback, 'SelectableRowCallback');

        // Redraw the whole table without refiltering and resorting.
        this.oDTSettings.oInstance.fnDraw(false);
    };


    // ----------------------------------------------------------------
    //             FEATURE REGISTRATION
    //

    $.fn.dataTableExt.aoFeatures.push({
        fnInit:function (oDTSettings) {

            var options = typeof oDTSettings.oInit.oSelectable != 'undefined' ?
                oDTSettings.oInit.oSelectable : {};

            var selectable = new Selectable(oDTSettings, options);


            return null;
        },

        cFeature:"S",

        sFeature:"Selectable"
    });


})(jQuery);