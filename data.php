<?php

/*
 * Script retrieves test data for testing server-side data. 
 */ 
 
 $data = array(
    array('id' =>  1, 0 => '', 1 => 'Trident',   2 => 'IE 4.0',        3 => 'Win 95+',           4 => '4',     5 => 'X'),
    array('id' =>  2, 0 => '', 1 => 'Trident',   2 => 'IE 5.0',        3 => 'Win 95+',           4 => '5',     5 => 'C'),
    array('id' =>  3, 0 => '', 1 => 'Trident',   2 => 'IE 5.5',        3 => 'Win 95+',           4 => '5.5',   5 => 'A'),
    array('id' =>  4, 0 => '', 1 => 'Trident',   2 => 'IE 6',          3 => 'Win 98+',           4 => '6',     5 => 'A'),
    array('id' =>  5, 0 => '', 1 => 'Trident',   2 => 'IE 7',          3 => 'Win XP SP2+',       4 => '7',     5 => 'A'),
    array('id' =>  6, 0 => '', 1 => 'Trident',   2 => 'AOL browser',   3 => 'Win XP',            4 => '6',     5 => 'A'),
    array('id' =>  7, 0 => '', 1 => 'Gecko',     2 => 'Firefox 1.0',   3 => 'Win 98+ / OSX.2+',  4 => '1.7',   5 => 'A'),
    array('id' =>  8, 0 => '', 1 => 'Gecko',     2 => 'Firefox 1.5',   3 => 'Win 98+ / OSX.2+',  4 => '1.8',   5 => 'A'),
    array('id' =>  9, 0 => '', 1 => 'Gecko',     2 => 'Firefox 2.0',   3 => 'Win 98+ / OSX.2+',  4 => '1.8',   5 => 'A'),
    array('id' => 10, 0 => '', 1 => 'Gecko',     2 => 'Firefox 3.0',   3 => 'Win 2k+ / OSX.3+',  4 => '1.9',   5 => 'A'),
    array('id' => 11, 0 => '', 1 => 'Gecko',     2 => 'Camino 1.0',    3 => 'OSX.2+',            4 => '1.8',   5 => 'A'),
    array('id' => 12, 0 => '', 1 => 'Gecko',     2 => 'Camino 1.5',    3 => 'OSX.3+',            4 => '1.8',   5 => 'A'),
    array('id' => 13, 0 => '', 1 => 'Gecko',     2 => 'Netscape 7.2',  3 => 'Win 95+ / Mac OS 8.6-9.2', 4 => '1.7', 5 => 'A'),
    array('id' => 14, 0 => '', 1 => 'Gecko',     2 => 'Mozilla 1.0',   3 => 'Win 95+ / OSX.1+',  4 => 1,       5 => 'A'),
    array('id' => 15, 0 => '', 1 => 'Gecko',     2 => 'Mozilla 1.1',   3 => 'Win 95+ / OSX.1+',  4 => 1.1,     5 => 'A'),
    array('id' => 16, 0 => '', 1 => 'Gecko',     2 => 'Mozilla 1.2',   3 => 'Win 95+ / OSX.1+',  4 => 1.2,     5 => 'A'),
    array('id' => 17, 0 => '', 1 => 'Gecko',     2 => 'Mozilla 1.3',   3 => 'Win 95+ / OSX.1+',  4 => 1.3,     5 => 'A'),
    array('id' => 18, 0 => '', 1 => 'Gecko',     2 => 'Mozilla 1.4',   3 => 'Win 95+ / OSX.1+',  4 => 1.4,     5 => 'A'),
    array('id' => 19, 0 => '', 1 => 'Gecko',     2 => 'Mozilla 1.5',   3 => 'Win 95+ / OSX.1+',  4 => 1.5,     5 => 'A'),
    array('id' => 20, 0 => '', 1 => 'Gecko',     2 => 'Mozilla 1.6',   3 => 'Win 95+ / OSX.1+',  4 => 1.6,     5 => 'A'),
    array('id' => 21, 0 => '', 1 => 'Gecko',     2 => 'Mozilla 1.7',   3 => 'Win 98+ / OSX.1+',  4 => 1.7,     5 => 'A'),
    array('id' => 22, 0 => '', 1 => 'Gecko',     2 => 'Mozilla 1.8',   3 => 'Win 98+ / OSX.1+',  4 => 1.8,     5 => 'A'),
    array('id' => 23, 0 => '', 1 => 'Gecko',     2 => 'Seamonkey 1.1', 3 => 'Win 98+ / OSX.2+',  4 => '1.8',   5 => 'A'),
    array('id' => 24, 0 => '', 1 => 'Gecko',     2 => 'Epiphany 2.20', 3 => 'Gnome',             4 => '1.8',   5 => 'A')
);



$displayStart = isset($_REQUEST['iDisplayStart']) ? $_REQUEST['iDisplayStart'] : 0;
$displayLength = isset($_REQUEST['iDisplayLength']) ? $_REQUEST['iDisplayLength'] : 10;

$rows = array_slice($data, $displayStart, $displayLength);

$json = array(
    'iTotalRecords' => count($data),
    'iTotalDisplayRecords' => count($rows),
    'aaData' => $rows
);


echo json_encode($json);
