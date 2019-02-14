<?php

require_once('../model/netmex.php');
$login = new modelNetmex();
$data = $login::login($_POST);
if ($data) {
  session_start();
  $_SESSION['id'] = $data['data'][0]['idUser'];
  $_SESSION['nombre'] = $data['data'][0]['nombre']." ".$data['data'][0]['apellidos'];
  $_SESSION['rol'] = $data['data'][0]['rol'];
}
die(json_encode($data));

?>
