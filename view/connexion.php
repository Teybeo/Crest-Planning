<form action="main.php" method="POST">

	<?php
	if ($_SESSION['isConnected'] == false)
	{
	    echo '
	    <input type="text" name="login" placeholder="Login"/>
	    <input type="password" name="password" placeholder="Password"/>';
	}
	?>
    <input type="submit" name="submit" value="<?php echo $_SESSION['isConnected'] ? 'Deconnexion' : 'Connexion'; ?>"/>

</form>

<?php
if ($_SESSION['isConnected'] == false)
{
    echo "Vous n'etes pas actuellement connecté";
}
else
{
   echo $_SESSION['login']." est actuellement connecté";
}
?>