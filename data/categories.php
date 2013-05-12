<?php

function getCategories() {

	global $bdd;

	$reponse = $bdd->query('
		SELECT nom
		FROM categorie
	');


	$categories = array();
	$i = 0;
	$ligne = $reponse->fetch(PDO::FETCH_ASSOC);

	while ($ligne != false) {

		$categories[$i] = $ligne;
		$i++;
		$ligne = $reponse->fetch(PDO::FETCH_ASSOC);
	}

	return $categories;
}

?>