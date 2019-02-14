<?php
session_start();
unset($_SESSION['id']);
unset($_SESSION['nombre']);
unset($_SESSION['rol']);
header ("Location: http://localhost/Netmex");
?>
