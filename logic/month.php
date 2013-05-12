<?php

session_start();

include('../data/connexion_bdd.php');

include("../data/event.php");

include("../data/categories.php");

if (isset($_POST['month']) && isset($_POST['year']))
{
	echo json_encode( buildMonthData($_POST['month'], $_POST['year']));
}
else if (isset($_POST['event']))
{
	$event = json_decode($_POST['event'], true);

	$event['idCompte'] = $_SESSION['idCompte'];

	insertEvent($event);

	echo getEventID($event);
}
else if (isset($_POST['updateEvent']))
{
	$event = json_decode($_POST['updateEvent'], true);

	updateEvent($event);
}
else if (isset($_POST['idEvent']))
{
	deleteEvent($_POST['idEvent']);
}
else if (isset($_POST['categories']) )
{
	echo json_encode(getCategories());
}

// Construit un tableau contenant les events du mois demandé et du compte connecté
/*
 * Event monthData[28-31][nbEvents];
 *
 * monthData
 * {
 * 		Day[28-31]
 * 		{
 * 			Event[*]
 *		}
 * }
 */
function buildMonthData($mois, $annee) {

	$daysInMonth = getNumberOfDaysInMonth($mois, $annee);

	$month = Array();

	if ($_SESSION['isConnected'])
		$compte = $_SESSION['idCompte'];
	else
		$compte = 1;

	$eventsInMonth = get_eventsFromMonth($compte, $mois);

	// On compare les dates de chaque jour du mois avec celles de chaque event
	for ($day = 0; $day < $daysInMonth; $day++)
	{
		$dayDateObject = DateTime::createFromFormat("Y-m-d", $annee.'-'.$mois.'-'.($day+1));
		$dayDate = $dayDateObject->format('Y-m-d');

		$eventsInDay = null;
		$i = 0;

		foreach ($eventsInMonth as $j => $event)
		{
			$dateEventObject = DateTime::createFromFormat("Y-m-d H:i:s", $event['debut']);
			$dateEvent = $dateEventObject->format('Y-m-d');

			// On compare les dates Y-m-d et on rentre l'event dans le tableau
			if ($dayDate == $dateEvent)
			{
				$eventsInDay[$i] = $event;
				$i++;
			}
		}

		$month[$day] = $eventsInDay;
	}

	return $month;
}

// Construit un tableau contenant les events du mois demandé et du compte connecté
function buildMonthData2($mois, $annee) {

	$daysInMonth = getNumberOfDaysInMonth($mois, $annee);

	$month = Array();

	if ($_SESSION['isConnected'])
		$compte = $_SESSION['idCompte'];
	else
		$compte = 1;

	$events = get_eventsFromMonth($compte, $mois);

	// On compare les dates de chaque jour du mois avec celles de chaque event
	for ($day = 0; $day < $daysInMonth; $day++)
	{
		$dayDateObject = DateTime::createFromFormat("Y-m-d", $annee.'-'.$mois.'-'.($day+1));
		$dayDate = $dayDateObject->format('Y-m-d');

		$month[$day] = null;

		foreach ($events as $i => $event)
		{
			$dateEventObject = DateTime::createFromFormat("Y-m-d H:i:s", $event['debut']);
			$dateEvent = $dateEventObject->format('Y-m-d');

			// On compare les dates Y-m-d et on rentre l'event dans le tableau
			if ($dayDate == $dateEvent)
			{
				$month[$day] = $event;
			}
		}
	}

	return $month;
}

// Accepte un mois, entre 1 et 12, et une année
// Retourne le nombre de jours du mois, égal au dernier jour du mois
// (en prenant en compte les années bisextiles)
function getNumberOfDaysInMonth($mois, $annee) {

	$daysInEachMonth = Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

	// Les années bisextiles, Février compte 29 jours au lieu de 28
	if ($annee % 4 == 0)
		$daysInEachMonth[1] = 29;

	return $daysInEachMonth[$mois - 1]; // On décalle l'intervalle vers [0, 11]
}

?>