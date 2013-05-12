<?php

include("data/getUser.php");

// Des données ont été envoyées
if (isset($_POST['submit']))
{

	// On veut se connecter
    if ($_POST['submit'] == 'Connexion' && isset($_POST['login']) && isset($_POST['password']) )
    {

    	$id = getUser($_POST['login'], $_POST['password']);

		if ($id != -1) {

            $_SESSION['isConnected'] = true;
			$_SESSION['login'] = $_POST['login'];
			$_SESSION['idCompte'] = $id;
		}

    }

	// On veut se deconnecter
    else if ($_POST['submit'] == 'Deconnexion' )
    {
        session_destroy();
		$_SESSION['isConnected'] = false;
	}

}

?>
