// Sample data for datatables.

// This dataset is for applying the plugin to the first column
var aDataSet = [
    ['', 'Trident', 'Internet Explorer 4.0',    'Win 95+',          '<input type="checkbox" /> 4','X'],
    ['', 'Trident', 'Internet Explorer 5.0',    'Win 95+',          '<input type="checkbox" checked="checked"/> 5','C'],
    ['', 'Trident', 'Internet Explorer 5.5',    'Win 95+',          '<input type="checkbox" /> 5.5','A'],
    ['', 'Trident', 'Internet Explorer 6',      'Win 98+',          '<input type="checkbox" checked="checked"/> 6','A'],
    ['', 'Trident', 'Internet Explorer 7',      'Win XP SP2+',      '<input type="checkbox" /> 7','A'],
    ['', 'Trident', 'AOL browser (AOL desktop)','Win XP',           '<input type="checkbox" checked="checked"/> 6','A'],
    ['', 'Gecko',   'Firefox 1.0',              'Win 98+ / OSX.2+', '<input type="checkbox" /> 1.7','A'],
    ['', 'Gecko',   'Firefox 1.5',              'Win 98+ / OSX.2+', '<input type="checkbox" checked="checked"/> 1.8','A'],
    ['', 'Gecko',   'Firefox 2.0',              'Win 98+ / OSX.2+', '<input type="checkbox" /> 1.8','A'],
    ['', 'Gecko',   'Firefox 3.0',              'Win 2k+ / OSX.3+', '<input type="checkbox" checked="checked"/> 1.9','A'],
    ['', 'Gecko',   'Camino 1.0',               'OSX.2+',           '<input type="checkbox" /> 1.8','A'],
    ['', 'Gecko',   'Camino 1.5',               'OSX.3+',           '<input type="checkbox" checked="checked"/> 1.8','A'],
    ['', 'Gecko',   'Netscape 7.2',             'Win 95+ / Mac OS 8.6-9.2','<input type="checkbox" /> 1.7','A'],
    ['', 'Gecko',   'Netscape Browser 8',       'Win 98SE+',        '<input type="checkbox" checked="checked"/> 1.7','A'],
    ['', 'Gecko',   'Netscape Navigator 9',     'Win 98+ / OSX.2+', '<input type="checkbox" /> 1.8','A'],
    ['', 'Gecko',   'Mozilla 1.0',              'Win 95+ / OSX.1+', '<input type="checkbox" checked="checked"/> 1','A'],
    ['', 'Gecko',   'Mozilla 1.1',              'Win 95+ / OSX.1+', '<input type="checkbox" /> 1.1','A'],
    ['', 'Gecko',   'Mozilla 1.2',              'Win 95+ / OSX.1+', '<input type="checkbox" checked="checked"/> 1.2','A'],
    ['', 'Gecko',   'Mozilla 1.3',              'Win 95+ / OSX.1+', '<input type="checkbox" /> 1.3','A'],
    ['', 'Gecko',   'Mozilla 1.4',              'Win 95+ / OSX.1+', '<input type="checkbox" checked="checked"/> 1.4','A'],
    ['', 'Gecko',   'Mozilla 1.5',              'Win 95+ / OSX.1+', '<input type="checkbox" /> 1.5','A'],
    ['', 'Gecko',   'Mozilla 1.6',              'Win 95+ / OSX.1+', '<input type="checkbox" checked="checked"/> 1.6','A'],
    ['', 'Gecko',   'Mozilla 1.7',              'Win 98+ / OSX.1+', '<input type="checkbox" /> 1.7','A'],
    ['', 'Gecko',   'Mozilla 1.8',              'Win 98+ / OSX.1+', '<input type="checkbox" checked="checked"/> 1.8','A'],
    ['', 'Gecko',   'Seamonkey 1.1',            'Win 98+ / OSX.2+', '<input type="checkbox" /> 1.8','A'],
    ['', 'Gecko',   'Epiphany 2.20',            'Gnome',            '<input type="checkbox" checked="checked"/> 1.8','A']
];

// The second column will contain enumeration.
// DO NOT CHANGE!!! As the data is used in tests.
var aDataSetWithID = [
    {'id':  1, 0: '', 1: 'Trident',   2: 'IE 4.0',        3: 'Win 95+',           4: '4',     5: 'X'},
    {'id':  2, 0: '', 1: 'Trident',   2: 'IE 5.0',        3: 'Win 95+',           4: '5',     5: 'C'},
    {'id':  3, 0: '', 1: 'Trident',   2: 'IE 5.5',        3: 'Win 95+',           4: '5.5',   5: 'A'},
    {'id':  4, 0: '', 1: 'Trident',   2: 'IE 6',          3: 'Win 98+',           4: '6',     5: 'A'},
    {'id':  5, 0: '', 1: 'Trident',   2: 'IE 7',          3: 'Win XP SP2+',       4: '7',     5: 'A'},
    {'id':  6, 0: '', 1: 'Trident',   2: 'AOL browser',   3: 'Win XP',            4: '6',     5: 'A'},
    {'id':  7, 0: '', 1: 'Gecko',     2: 'Firefox 1.0',   3: 'Win 98+ / OSX.2+',  4: '1.7',   5: 'A'},
    {'id':  8, 0: '', 1: 'Gecko',     2: 'Firefox 1.5',   3: 'Win 98+ / OSX.2+',  4: '1.8',   5: 'A'},
    {'id':  9, 0: '', 1: 'Gecko',     2: 'Firefox 2.0',   3: 'Win 98+ / OSX.2+',  4: '1.8',   5: 'A'},
    {'id': 10, 0: '', 1: 'Gecko',     2: 'Firefox 3.0',   3: 'Win 2k+ / OSX.3+',  4: '1.9',   5: 'A'},
    {'id': 11, 0: '', 1: 'Gecko',     2: 'Camino 1.0',    3: 'OSX.2+',            4: '1.8',   5: 'A'},
    {'id': 12, 0: '', 1: 'Gecko',     2: 'Camino 1.5',    3: 'OSX.3+',            4: '1.8',   5: 'A'},
    {'id': 13, 0: '', 1: 'Gecko',     2: 'Netscape 7.2',  3: 'Win 95+',           4: '1.7',   5: 'A'},
    {'id': 14, 0: '', 1: 'Gecko',     2: 'Mozilla 1.0',   3: 'Win 95+ / OSX.1+',  4: '1',     5: 'A'},
    {'id': 15, 0: '', 1: 'Gecko',     2: 'Mozilla 1.1',   3: 'Win 95+ / OSX.1+',  4: '1.1',   5: 'A'},
    {'id': 16, 0: '', 1: 'Gecko',     2: 'Mozilla 1.2',   3: 'Win 95+ / OSX.1+',  4: '1.2',   5: 'A'},
    {'id': 17, 0: '', 1: 'Gecko',     2: 'Mozilla 1.3',   3: 'Win 95+ / OSX.1+',  4: '1.3',   5: 'A'},
    {'id': 18, 0: '', 1: 'Gecko',     2: 'Mozilla 1.4',   3: 'Win 95+ / OSX.1+',  4: '1.4',   5: 'A'},
    {'id': 19, 0: '', 1: 'Gecko',     2: 'Mozilla 1.5',   3: 'Win 95+ / OSX.1+',  4: '1.5',   5: 'A'},
    {'id': 20, 0: '', 1: 'Gecko',     2: 'Mozilla 1.6',   3: 'Win 95+ / OSX.1+',  4: '1.6',   5: 'A'},
    {'id': 21, 0: '', 1: 'Gecko',     2: 'Mozilla 1.7',   3: 'Win 98+ / OSX.1+',  4: '1.7',   5: 'A'},
    {'id': 22, 0: '', 1: 'Gecko',     2: 'Mozilla 1.8',   3: 'Win 98+ / OSX.1+',  4: '1.8',   5: 'A'},
    {'id': 23, 0: '', 1: 'Gecko',     2: 'Seamonkey 1.1', 3: 'Win 98+ / OSX.2+',  4: '1.8',   5: 'A'},
    {'id': 24, 0: '', 1: 'Gecko',     2: 'Epiphany 2.20', 3: 'Gnome',             4: '1.8',   5: 'A'}
];