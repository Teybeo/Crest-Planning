	<div class="Banniere">

		<div id="Logo">
			<a href="main.php"><img src="image/logo.png" width="100%" height="100%"></a>
		</div>

		<div id="SousTitre">
			<h1 style="color: rgb(242, 242, 242);" >Le site de la mairie de Crest</h1>
		</div>

		<div id="Navigation">

			<div class="Menu" >
				<a href="main.php?page=planning" style="display:block;width:100%;height:100%;">
					Planning
				</a>
			</div>

			<div class="Menu" >

				Catégories
				<div class="SousMenu">
					<a >Catégorie 1</a>
					<a >Catégorie 2</a>
				</div>

			</div>

			<div class="Menu">

				Personnes
				<div class="SousMenu">
					<a >Recherche</a>
					<a >Plus actifs</a>
				</div>

			</div>

		</div>

		<div id="Connexion">
			<?php
				include('view/connexion.php');
			?>
		</div>

	</div>