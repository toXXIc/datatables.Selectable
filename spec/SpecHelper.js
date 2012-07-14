
// Global variable which always points to created datatable api.
var $table = null;
var dTable = null;

var SELECTION_CLASS = 'selected';

var commonDefaults = {
    "aoColumns": [
        { "sTitle": "#" },
        { "sTitle": "Engine" },
        { "sTitle": "Browser" },
        { "sTitle": "Platform" },
        { "sTitle": "Version", "sClass": "center" },
        {
            "sTitle": "Grade",
            "sClass": "center"
        }
    ],
    sDom: 'lfrtipS'
};


var testTableDefaults = $.extend({}, commonDefaults, {
    "aaData": aDataSet
});

var remoteTableDefaults = $.extend({}, commonDefaults, {
    "bServerSide": true,
    "sAjaxSource": "data.php"
});


// Returns cells for specified column
function findColCells(colNum) {
    if (!colNum)
        colNum = 1;
        
    return $table.find('tbody tr td:nth-child(' + colNum + ')');
}

// Returns checkboxes for specified column
function findColCheckboxes(colNum) {
    if (!colNum)
        colNum = 1;
        
    return findColCells(colNum).find('input:checkbox');
}



function initDataTable(selectableOpts, tableOpts) {
    $table = $('<table class="styled" id="tbl"></table>');
    $table.appendTo($('.tbl_container'));

    var options = $.extend({}, testTableDefaults, tableOpts);
    if (selectableOpts)
        options.oSelectable = selectableOpts;

    dTable = $('#tbl').dataTable(options);
}


function initRemoteDataTable(selectableOpts, tableOpts) {
    $table = $('<table class="styled" id="tbl"></table>');
    $table.appendTo($('.tbl_container'));

    var options = $.extend({}, remoteTableDefaults, tableOpts);
    if (selectableOpts)
        options.oSelectable = selectableOpts;

    dTable = $('#tbl').dataTable(options);
}

function removeDataTable() {
    $('.tbl_container').html('');
    dTable = $table = null;
}


/**
 * Adds row data to selection using oSelection.fnAdd method. Data object is specified by dataIndex.
 * @param dataIndex Index of data object in dataTable.aoData array.
 * @return Data object.
 */
function selectionAdd(dataIndex)
{
    var data = dTable.fnGetData()[dataIndex];
    dTable.oSelection.fnAdd(data);
    return data;
}


/**
 * Returns jQuery object of a row, specified by rowNum.
 * @param rowNum
 */
function getRow(rowNum)
{
    //return $(dTable.fnGetNodes(rowNum));
    return $table.find('tbody tr:nth-child(' + rowNum + ')');
}


/**
 * Adds row data to selection using oSelection.fnAdd method. Data object is requested using row,
 * specified by rowIndex.
 * @param rowNum Number of a row which data will be added to selection.
 * @return Row jQuery object.
 */
function selectionAddRow(rowNum)
{
    var $row = getRow(rowNum);
    var data = dTable.fnGetData($row[0]);
    dTable.oSelection.fnAdd(data);

    return $row;
}


function getRowCheckbox(rowNum)
{
    return getRow(rowNum).find('td:nth-child(1) input:checkbox');
}


// ---------------------------------------------
beforeEach(function() {
    this.addMatchers({

        /**
         * Checks if passed table row has 'selected' class and selection checkbox is checked.
         */
        toBeCheckedRow: function() {
            var $row = this.actual;

            var colNum = dTable._oSelectable.options.iColNumber;
            var $check = $row.find('td:nth-child(' + colNum + ') input:checkbox');
                
            var hasClass = $row.hasClass(SELECTION_CLASS);
            var isChecked = $check.is(':checked');


            this.message = function () {
                var exp = '';

                if ($check.length == 0)
                    exp = 'Checkbox is not found in row #' + $row.index();
                else {
                    if (!hasClass)
                        exp += ' Row should have "' + SELECTION_CLASS + '" class. ';
                    if (!isChecked)
                        exp += ' Row should have checked checkbox in column ' + colNum + '.';
                }
                    
                return "Expectations for row #" + $row.index() + ":" + exp;// to have '" + SELECTION_CLASS + "' class and to contain checked checkbox in column " + colNum;
            };

            return hasClass && isChecked;
        },

        toBeUncheckedRow: function() {
            var $row = this.actual;
            var colNum = dTable._oSelectable.options.iColNumber;
            var $check = $row.find('td:nth-child(' + colNum + ') input:checkbox');
            
            var hasClass = $row.hasClass(SELECTION_CLASS);
            var isChecked = $check.is(':checked');
            
            this.message = function () {
                var exp = '';

                if ($check.length == 0)
                    exp = 'Checkbox is not found in row #' + $row.index();
                else {
                    if (hasClass)
                        exp += ' Row shouldn\'t have "' + SELECTION_CLASS + '" class. ';
                    if (isChecked)
                        exp += ' Row shouldn\'t have checked checkbox in column ' + colNum + '.';
                }

                return "Expectations for row #" + $row.index() + ":" + exp;// to have no '" + SELECTION_CLASS + "' class and to contain unchecked checkbox in column " + colNum;
            };

            return !hasClass && !isChecked;
        }
    });
});



afterEach(function () {
    removeDataTable();
});
