<?php

$jsConnexionState =
	'var isConnected = ' . ($_SESSION['isConnected'] ? 'true' : 'false') . ';
	' ;

include('data/event.php');

include('view/planning.php');

?>
