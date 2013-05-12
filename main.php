<?php

session_start();

include('data/connexion_bdd.php');

if ( !isset($_SESSION['isConnected']) )
    $_SESSION['isConnected'] = FALSE;

$page = "logic/index.php";

if( isset($_GET['page']) ) {

	if ($_GET['page'] == 'planning')
		$page = 'logic/planning.php';
}

include($page);

?>
