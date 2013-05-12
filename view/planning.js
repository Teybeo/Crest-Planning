var currentMonth;
var currentYear;
var currentDay;
var monthData;
var categories;

function initCalendar() {

	var now = new Date(Date.now());

	currentMonth = now.getMonth();
	currentYear = now.getFullYear();
	currentDay = now.getDate();

	requestMonthData(currentMonth, currentYear);
	requestCategories();
}

function printNextMonth() {

	currentMonth++;
	if (currentMonth == 13)
	{
		currentMonth = 1;
		currentYear++;
	}

	requestMonthData(currentMonth, currentYear);
}

function printPreviousMonth() {

	currentMonth--;
	if (currentMonth == 0)
	{
		currentMonth = 12
		currentYear--;
	}

	requestMonthData(currentMonth, currentYear);
}

// Récupère les données du mois et les affiche
function requestMonthData(month, year) {

	var data = 'month=' + month + '&year=' + year;

	var xhr = new XMLHttpRequest();

	xhr.open('POST', 'logic/month.php', true);

	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');

	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			monthData = JSON.parse(this.responseText);

			printMonth(monthData);
			//document.getElementById('Error').innerHTML = this.responseText;
		}
	};

	xhr.send(data);

}

// Récupère les catégories d'events
function requestCategories() {

	var xhr = new XMLHttpRequest();

	xhr.open('POST', 'logic/month.php', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhr.onreadystatechange = function ()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			categories = JSON.parse(this.responseText);

			//document.getElementById('Error').innerHTML = this.responseText;
		}
	}

	xhr.send('categories=all');

}

function printMonth(monthData) {

	var firstDayOfWeek = getFirstDayOfWeekFromMonth(currentMonth);
	var color;

	// On affiche le mois et l'année actuelle
	document.getElementById('DateText').innerHTML = getMonthName(currentMonth) + ' ' + currentYear;

	// On parcourt chaque case du tableau (6 semaines = 6 * 7 = 42 cases)
	for (i = 0; i < 42; i++)
	{
		// C'est un jour du mois
		if (firstDayOfWeek <= i && (i - firstDayOfWeek) < monthData.length)
		{
			var data = '<div>'+ (i - firstDayOfWeek + 1) +'</div>';

			// S'il y a des events, on affiche leur nombre
			if (monthData[i - firstDayOfWeek] != null)
				data += '<br/>'+monthData[i - firstDayOfWeek].length +' events';

			document.getElementById(i).setAttribute("onClick", "updatePanel("+(i - firstDayOfWeek)+");");
			color = 'white';
		}
		else // Jour du mois précédent ou suivant
		{
			data = "";
			color = 'rgb(238, 238, 238)';
		}

		document.getElementById(i).style.backgroundColor = color;
		document.getElementById(i).innerHTML = data;
	}

}

// Gère l'affichage du cadre juxtaposé au calendrier
// Affiche les events prévus pour un jour du mois
// Permet la création d'event
// Cette fonction est appellée en cliquant sur un jour du calendrier
// day: jour de l'event [0, finMois - 1]
function updatePanel(day) {

	var data = "";

	//alert('Update day:' + day);

	// 0 events ce jour
	if (monthData[day] == null) {

		data += '<h3>Aucun évènement</h3></br>';

		if (isConnected)
		{
			data += '<input type="button" value="Créer" onClick="presentEventCreationForm('+ day +');">';
		}

		document.getElementById('Event').innerHTML = data;
	}
	// 1 event ce jour
	else if (monthData[day].length == 1) {

		presentEvent(day, 0);
	}
	// plusieurs events ce jour
	else {

		presentMultipleEvents(day);

	}

}

function presentMultipleEvents(day) {

	var data = "";

	data += '<table>';

	for (var i = 0; i < monthData[day].length; i++)
	{
		data += '<tr>';

		data += '<td onClick="presentEvent('+ day +', '+ i +')">'+ monthData[day][i]['titre'] +'</td>';

		data += '</tr>';
	}

	data += '</table>';

	if (isConnected)
		data += '<input type="button" value="Créer" onClick="presentEventCreationForm('+ day +');">';

	document.getElementById('Event').innerHTML = data;

}

// Affiche le détail d'un event
// day: jour de l'event [0, finMois - 1]
// index: index de l'event dans le tableau des events du jour
function presentEvent(day, index) {

	var event = monthData[day][index];

	//var debut = new Date(event['debut_time'] * 1000);
	//var fin = new Date(event['fin_time'] * 1000);

	var debut = new Date(event['debut'].replace(/-/g, '/'));
	var fin = new Date(event['fin'].replace(/-/g, '/'));

	var dayWeek = debut.getDay();

	if (dayWeek == 0)
		dayWeek = 7;
	dayWeek--;

	var debutString =
		getDayName(dayWeek) 	+' '+
	 	debut.getDate()					+' '+
 		getMonthName(currentMonth)		+' '+
		currentYear;

	var data =
		'<h3>'+ event['titre'] +'</h3>'+
		debutString +'</br>'+
		debut.getHours() +'h'+ debut.getMinutes() +' -> '+
		fin.getHours()+'h'+fin.getMinutes() +'</br>'+
		categories[ event['idCategory'] ]['nom'] +'</br>'+
		event['description'];

	if (isConnected)
	{
		data += '</br><input type="button" value="Supprimer" onClick="presentEventDeletionForm('+ day +', '+ index +');">';
		data += '<input type="button" value="Créer" onClick="presentEventCreationForm('+ day +');">';
		data += '<input type="button" value="Modifier" onClick="presentEventModificationForm('+ day +', '+ index +');">';
	}

	if (monthData[day].length > 1)
		data += '<input type="button" value="Retour" onClick="presentMultipleEvents('+ day +')">';


	document.getElementById('Event').innerHTML = data;
}


function presentEventModificationForm(day, index) {

	presentEventCreationForm(day);

	document.eventForm.setAttribute("onsubmit", "if (validateForm(this, "+ day +")) updateEvent("+ day +", "+ index +"); return false;");
	document.eventForm.titre.value = monthData[day][index]['titre'];
    document.eventForm.description.value = monthData[day][index]['description'];
    document.getElementById('categorie').options.selectedIndex = monthData[day][index]['idCategory'];

    var debut = new Date(monthData[day][index]['debut'].replace(/-/g, '/'));
    var fin = new Date(monthData[day][index]['fin'].replace(/-/g, '/'));

    document.eventForm.debut.value = debut.getHours() +':'+ debut.getMinutes();
    document.eventForm.fin.value = fin.getHours() +':'+ fin.getMinutes();
}

// Cette fonction construit le formulaire de création d'event
// day: jour de l'event [0, finMois - 1]
function presentEventCreationForm(day) {

	var data = "";

	data += '<form name="eventForm" onSubmit="if (validateForm(this, '+day+')) generateEvent('+ day +'); return false;">';

		data += '<label for="titre">Titre</label> <input type="text" name="titre" maxlength="20" placeholder="Titre" value="Titre" id="titre" required>';

		data += '<label for="debut">Heure début</label> <input type="text" name="debut" id="debut" placeholder="hh:mm" value="11:11" required><div id="ErrorDeb">Erreur</div>';

		data += '<label for="fin">Heure fin</label> <input type="text" name="fin" id="fin" placeholder="hh:mm" value="11:51" required><div id="ErrorFin">Erreur</div>';

		data += '<label for="texte">Description</label> <textarea name="description" id="description" cols="40"></textarea></br>';

		data += '<select id="categorie">';

			for (var i = 0; i < categories.length; i++)
				data += '<option id="idCat'+ i +'">'+ categories[i]['nom'] +'</option>';

		data += '</select>';

		data += '<input type="submit" name="submit" value="Valider">';

	data += '</form>';

	document.getElementById('Event').innerHTML = data;

}

// Cette fonction construit le formulaire de création d'event
// day: jour de l'event [0, finMois - 1]
// index: index de l'event dans le tableau des events du jour
function presentEventDeletionForm(day, index) {

	var data = "";

	data += 'Confirmer la suppression:</br>';
	data += '<input type="button" name="delete" value="Oui" onClick="deleteEvent('+ day +', '+ index +')">';
	data += '<input type="button" name="delete" value="Non" onClick="presentEvent('+ day +', '+ index +')">';

	document.getElementById('Event').innerHTML = data;
}

function updateEvent(day, index) {

    var event = formatEvent(day);

    event['idEvent'] = monthData[day][index]['idEvent'];
    event['idCompte'] = monthData[day][index]['idCompte'];

    var data = 'updateEvent='+ JSON.stringify(event);

    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'logic/month.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200)
        {
            document.getElementById('Error').innerHTML = this.responseText;

        }
    }

    xhr.send(data);

    monthData[day][index] = event;

    presentEvent(day, index);
    printMonth(monthData);

}

// Envoie la requete de suppression au serveur
// day: jour de l'event [0, finMois - 1]
// index: index de l'event dans le tableau des events du jour
function deleteEvent(day, index) {

	var data = 'idEvent='+ monthData[day][index]['idEvent'];

	var xhr = new XMLHttpRequest();

	xhr.open('POST', 'logic/month.php', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhr.send(data);

	// Suppression immédiate de l'event en local pour l'affichage
	if (monthData[day].length == 1)
		monthData[day] = null;
	else
		monthData[day].splice(index, 1);

	updatePanel(day);
	printMonth(monthData);

}

// Construit un tableau associatif représentant un event
// et envoie le tableau encodé en JSON à une page php via ajax
// day: jour de l'event [0, finMois - 1]
function generateEvent(day) {

    var event = formatEvent(day);

	var data = 'event=' + JSON.stringify(event);

	var xhr = new XMLHttpRequest();

	xhr.open('POST', 'logic/month.php', true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200) {

			//document.getElementById ('Error').innerHTML = this.responseText;
			monthData[day][monthData[day].length]['idEvent'] = this.responseText;

			// Rafraichit l'affichage du mois
			//requestMonthData(currentMonth, currentYear, false);

			//alert('Create event:' + day);

		}
	};

	xhr.send(data);

	// Mise à jour immédiate des données locales pour pas bloquer affichage
	if (monthData[day] != null)
		monthData[day][monthData[day].length] = event;
	else
	{
		monthData[day] = Array();
		monthData[day][0] = event;
	}
	//alert('OSEF');
	// Rafraichit le panneau
	updatePanel(day);
	printMonth(monthData);

}

// Vérifie que les heures de début et de fin sont bien formatées et signale les champs incorrects
function validateForm(form, day) {

	var isCorrect = true;

	if (validateHour(form['debut'].value) == false)
	{
		document.getElementById('ErrorDeb').style.visibility = 'visible';
		document.getElementById('debut').style.boxShadow = '0 0 1.5px 1px red';

		isCorrect = false;
	}
	else
	{
		document.getElementById('ErrorDeb').style.visibility = 'hidden';
		document.getElementById('debut').style.boxShadow = '0 0 0 0';
	}

	if (validateHour(form['fin'].value) == false)
	{
		document.getElementById('ErrorFin').style.visibility = 'visible';
		document.getElementById('fin').style.boxShadow = '0 0 1.5px 1px red';
	 	isCorrect = false;
	}
	else
	{
		document.getElementById('ErrorFin').style.visibility = 'hidden';
		document.getElementById('fin').style.boxShadow = '0 0 0 0';
	}

	return isCorrect;
}

// Valide une heure sous le format hh:mm
// Vérifie les intervalles [00-23] et [00-59]
// Renvoie un booléen
function validateHour(heure) {

	var format = new RegExp("^[0-9]{2}:[0-9]{2}$");

	if (format.test(heure) == true)
	{
		var hm = heure.split(':');

		if (hm[0] >= 0 && hm[0] <= 23 && hm[1] >= 0 && hm[1] <= 59)
			return true;
	}

	return false;

}

function formatEvent(day) {

    var heureDebut = currentYear +'-'+ currentMonth +'-'+ (day + 1) +' '+ document.getElementById ('debut').value +':00';
    var heureFin   = currentYear +'-'+ currentMonth +'-'+ (day + 1) +' '+ document.getElementById ('fin').value +':00';

    var event = {};
    event['titre'] = document.getElementById ('titre').value;
    event['description'] = document.getElementById ('description').value;
    event['idCategory'] = document.getElementById('categorie').options.selectedIndex;
    event['debut'] = heureDebut;
    event['fin'] = heureFin;

    return event;
}

// Accepte un mois, entre 1 et 12
// Retourne le nom du mois correspondant
function getMonthName(month) {

	var monthNames = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre" ];

	return monthNames[month - 1]; // On décalle l'intervalle vers [0, 11]
}

// Accepte un jour, entre 0 et 6
// Retourne le nom du jour correspondant
function getDayName(name) {

	var dayNames = [ "Lundi", "Mardi", "Mercredi", "Jeudi",	"Vendredi",	"Samedi", "Dimanche" ];

	return dayNames[name];
}

// Accepte un mois entre 1 et 12
// Retourne le jour de la semaine correspondant au premier jour du mois (entre 0 et 6)
function getFirstDayOfWeekFromMonth(month) {

    var d = new Date(Date.now());

    d.setMonth(month - 1); // La fonction marche en [0-11]
	d.setDate(1); // Premier jour du mois

	var day = d.getDay();

	if (day == 0)
		day = 7;
	day--;

    return day;

}

function exportData(type) {

    var data;

    if (type == 'HTML')
        data = exportAsHTML();
    else if (type == 'CSV')
        data = exportAsCSV();

    launchDL(data, type.toLowerCase());
}

function exportAsCSV() {

    var data = 'Titre, Debut, Fin, Description, Catégorie, Compte\n';

    for (var i = 0; i < monthData.length; i++)
    {
        if (monthData[i] == null)
            continue;

        for (var j = 0; j < monthData[i].length; j++)
        {
            var event = monthData[i][j];

            /*for (var champ in monthData[i][j])
            {
                data += monthData[i][j][champ] +',';
            }
           data += '\n';*/

           data += event['titre'] +','+ event['debut'] +','+ event['fin'] +',"'+ event['description'] +'",'+ categories[event['idCategory']]['nom'] +','+ event['idCompte'] +'\n';

        }
    }

    return data;

    //launchDL(data, 'csv');
}

function exportAsHTML() {

/*table {
    margin: auto;
    border: 2px solid;
    border-collapse: collapse;
}

th {
    background-color: rgb(54, 58, 56);
    color: rgb(230, 230, 230);
    border: 2px solid black;
    font-weight : strong;
    padding: 5px;
}

td  {
    border: 1px solid;
    padding:5px
}*/

    var data = "";

    data += '<table style="border: 2px solid;">';
    data +=     '<thead>';
    data +=         '<tr> <th>Titre</th> <th>Debut</th> <th>Fin</th> <th>Description</th> <th>Catégorie</th> <th>Compte</th> </tr>';
    data +=     '</thead';
    data +=     '<tbody>';

        for (var i = 0; i < monthData.length; i++)
        {
            if (monthData[i] == null)
                continue;

            for (var j = 0; j < monthData[i].length; j++)
            {
                var event = monthData[i][j];

                data += '<tr>';

                /*for (var champ in monthData[i][j])
                {
                    data += '<td>'+ monthData[i][j][champ] +'</td>';
                }*/
               data += '<td>'+ event['titre'] +'</td>'+
                       '<td>'+ event['debut'] +'</td>'+
                       '<td>'+ event['fin'] +  '</td>'+
                       '<td>'+ event['description'] +'</td>'+
                       '<td>'+ categories[event['idCategory']]['nom'] +'</td>'+
                       '<td>'+ event['idCompte'] +'</td>';
                data += '</tr>';
            }
        }

    data +=     '</tbody>';
    data += '</table>';

    //launchDL(data, 'html');
    return data;
    //document.getElementById('Error').innerHTML = data;

}

function launchDL(data, extension) {

    var planningBlob = new Blob([data], { "type" : "text/"+extension }); // On crée un blob en mémoire avec les données
    var planningUrl  = window.URL.createObjectURL(planningBlob);     // On crée une url vers ce blob

    document.getElementById('lien').href = planningUrl;
    document.getElementById('lien').download = "Planning "+ getMonthName(currentMonth) +' '+ currentYear +"."+ extension;
    document.getElementById('lien').click();

}
