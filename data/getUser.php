<?php

function getUser($login, $password) {

    global $bdd;

    $reponse = $bdd->query("
    			SELECT id
                FROM compte
                WHERE login = '".$login."'
                AND password = '".$password."'");

    $reponse = $reponse->fetch();

    if ($reponse == NULL)
        return -1;
    else
        return $reponse['id'];

}

?>