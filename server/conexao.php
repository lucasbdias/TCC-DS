	<?php
    $servidor = "localhost";
	$bd = "mkt";
	$usuario = "root";
	$senha = "";
	$con = new PDO("mysql:host=$servidor;dbname=$bd",
		$usuario,
		$senha,		
		array(PDO::MYSQL_ATTR_INIT_COMMAND => "
            SET NAMES utf8"));
?>
            
