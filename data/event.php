<?php

function updateEvent($event) {

	global $bdd;

	$requete = "
		UPDATE event
			set titre ='". $event['titre'] ."',
			debut ='". $event['debut'] ."',
			fin ='". $event['fin'] ."',
			description ='". $event['description'] ."'
		WHERE idEvent = ". $event['idEvent'];

	echo $requete;

	$bdd->query($requete);

}

function insertEvent($event) {

	global $bdd;

	//print_r($event);

	$requete = '
		INSERT INTO event
		(idCategory, idCompte, titre, description, debut, fin)
		VALUES ("'.$event['idCategory'].'", "'.$event['idCompte'].'", "'.$event['titre'].'", "'.$event['description'].'", "'.$event['debut'].'", "'.$event['fin'].'")';

//	echo $requete;

	$bdd->query($requete);

}

function deleteEvent($idEvent) {

	global $bdd;

	$requete = '
		DELETE FROM event
		WHERE idEvent = '. $idEvent .'
		';


	echo $requete;

	$bdd->query($requete);

}

function get_eventsFromMonth($compte, $month) {

	global $bdd;

	$reponse = $bdd->query("
							SELECT *
							FROM event
							WHERE idCompte = '".$compte."'
							AND extract(month FROM debut) = '".$month."' ");
	$events = array();
	$i = 0;
	$ligne = $reponse->fetch(PDO::FETCH_ASSOC);

	while ($ligne != false)
	{
		$events[$i] = $ligne;
		$i++;
		$ligne = $reponse->fetch(PDO::FETCH_ASSOC);
	}

	return $events;

	/*return $reponse->fetchAll();*/

}


function get_events($compte) {

	global $bdd;

	$reponse = $bdd->query("
							SELECT *
							FROM event
							WHERE idCompte = '".$compte."'");

	$res = array();
	$i = 0;
	$ligne = $reponse->fetch();

	while ($ligne != false)
	{
		$res[$i] = $ligne;
		$i++;
		$ligne = $reponse->fetch();
	}

	return $res;

	/*return $reponse->fetchAll();*/

}

function getEventID($event) {

	global $bdd;

	$reponse = $bdd->query('
							SELECT idEvent
							FROM event
							WHERE idCompte = "'.$event['idCompte'].'" AND
							idCategory = "'.$event['idCategory'].'" AND
							titre = "'.$event['titre'].'" AND
							description = "'.$event['description'].'" AND
							debut = "'.$event['debut'].'" AND
							fin = "'.$event['fin'].'"');

	$res = $reponse->fetch();

	return $res['idEvent'];

}

?>