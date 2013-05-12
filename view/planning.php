<!DOCTYPE HTML>

<html>

	<head>
		<title>Planning - Mairie de Crest</title>
		<meta charset="utf-8">
		<link rel="icon" type="image/png" href="image/icon.png"/>
		<link rel="stylesheet" type="text/css" href="css/StylePage.css"/>
		<link rel="stylesheet" type="text/css" href="css/Banniere.css"/>
		<link rel="stylesheet" type="text/css" href="css/Planning.css"/>
		<script type="text/javascript" src="view/planning.js"></script>
		<script type="text/javascript">
		<?php
			 print_r($jsConnexionState);
		?>
		</script>
	</head>

	<body onload="initCalendar()">

		<?php
			include('view/banniere.php');
		?>

		<div class="Corps" align="center">

		<span id="TitrePlanning">Page planning</span>

		<span id="ExportListe">
			Exporter en
			<select id='exportListe'>
				<option>HTML</option>
				<option>CSV</option>
			</select>

			<input type="button" value="Télécharger" onclick="exportData(document.getElementById('exportListe').value)">
		</span>

		<!--
		<input type="button" value="Export as HTML" onclick="exportAsHTML()" id="ExportHTML">
		<input type="button" value="Export as CSV" onclick="exportAsCSV()" id="ExportCSV">
		-->

		<a id="lien"></a>
		<input type="button" value="Precedent" onclick="printPreviousMonth()">

		<span id="DateText"></span>

		<input type="button" value="Suivant" onclick="printNextMonth()">

		<table border="1px" id="Calendar">
			<thead>
				<tr>
					<th>Lundi</th>
					<th>Mardi</th>
					<th>Mercredi</th>
					<th>Jeudi</th>
					<th>Vendredi</th>
					<th>Samedi</th>
					<th>Dimanche</th>
				</tr>
			</thead>
			<tbody>
		<?php

			for ($i = 0; $i < 42; $i++)
			{
				if ($i % 7 == 0)
					echo '<tr>
					';

				echo '<td id="'.$i.'"></td>

				';
				//echo '<td id="'.$i.'" onClick="presentEvents(this.id)"></td>

				if ( ($i + 1) % 7 == 0)
					echo '</tr>
					';
			}
		?>
			</tbody>
		</table>

		<div id="Event">

		</div>

		<div id="Error"></div>

		</div>

		<?php
			//include('Bas.php');
		?>

	</body>

</html>