<?php

    try
    {
    	$options = array();
		$options[PDO::MYSQL_ATTR_INIT_COMMAND] = 'SET NAMES utf8';
        $bdd = new PDO('mysql:host=localhost;dbname=planning', 'root', '', $options);
    }
    catch (Exception $e)
    {
        die('Erreur : '.$e->getMessage());
    }

?>