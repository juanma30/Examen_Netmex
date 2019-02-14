<?php
require_once('../model/netmex.php');
$data = new modelNetmex();
if ($_POST['flag'] == 0) {
  $arr = array(
                'idUser' => $_POST['idUser'],
                'titulo' => $_POST['titulo'],
                'descripcion' => $_POST['descripcion'],
                'fecha' => $_POST['fecha']
              );
  $response = $data::set_works($arr);
  if($response) die(json_encode(array("msj"=>"Se agrego la tarea satisfactoriamente","response"=>True)));
  else die(json_encode(array("msj"=>"Ocurrio un problema al agregar la tarea, intentalo mas tarde","response"=>False)));
}else {
  $arr = [];
  foreach ($_POST as $k => $val) {
    if(!in_array($k,['flag'])){
      $arr[$k] = $val;
    }
  }
  $response = $data::update_work($arr);
  if($response) die(json_encode(array("msj"=>"Se realizaron los cambios","response"=>True)));
  else die(json_encode(array("msj"=>"Ocurrio un problema al realizar los cambios, intentalo mas tarde","response"=>False)));
}

?>
