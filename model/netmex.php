<?php

/**
 *
 */
require_once('../database/conexion.php');
class modelNetmex
{

  private static $database;
  private static $data;

  public function __construct()
  {
    modelNetmex::$database = DbConect::conexion();
    modelNetmex::$data = array();
  }

  public static function login($data){
    if ($data && $data['email'] && $data['passw']) {
      $email = trim($data['email']);
      $passw = trim(md5($data['passw']));
      $query = modelNetmex::$database->query("SELECT * FROM users WHERE email = '${email}' AND password = '${passw}';");
      if ($query->num_rows){
        while ($rows = $query->fetch_assoc()) {
          modelNetmex::$data[] = $rows;
        }
        return array("session"=>True,"msj"=>"Sesion iniciada","data"=>modelNetmex::$data);
      }else die(json_encode(array("session"=>False,"msj"=>"El correo o la contraseña son incorrectas")));
    }else die(json_encode(array("session"=>False,"msj"=>"Ocurrio un error")));

  }

  public static function get_works($id = False,$status = ""){
    $filter = "WHERE t.isDelete = 0 ";
    $filter .= $id ? "AND t.idUser = ${id} " : "";
    $filter .= $status ? "AND t.estatus = '${status}' " : "";
    $sql = "
            SELECT 	t.idTarea,t.titulo,t.descripcion,t.fecha,t.estatus,
            		CONCAT(u.nombre,' ',u.apellidos) AS usuario
            FROM tareas t
            INNER JOIN users u ON t.idUser = u.idUser
            ${filter}
           ";
    $query = modelNetmex::$database->query($sql);
    if (isset($query->num_rows) && $query->num_rows) {
      while ($rows = $query->fetch_assoc()) {
        modelNetmex::$data[] = $rows;
      }
    }
    return modelNetmex::$data;
  }

  public static function set_works($data = NULL){
    $arr = array(
                  'idUser' => $_POST['idUser'],
                  'titulo' => $_POST['titulo'],
                  'descripcion' => $_POST['descripcion'],
                  'fecha' => $_POST['fecha']
                );
    $campos = "";
    $valores = "";
    foreach ($data as $campo => $valor) {
      $campos .= "${campo},";
      $valores .= ($campo != 'idUser' ? "'${valor}'," : "${valor},");
    }
    $campos = trim($campos,",");
    $valores = trim($valores,",");
    $sql = "INSERT INTO tareas (${campos}) VALUES(${valores})";
    $query = modelNetmex::$database->query($sql);
    return $query;
  }

  public static function update_work($data = NULL){
    $campos = "";
    foreach ($data as $campo => $valor) {
      $campos .= $campo != 'idTarea' ? ($campo == 'isDelete'? "${campo} = ${valor}," : "${campo} = '${valor}',") : "";
    }
    $campos = trim($campos,',');
    $sql = " UPDATE tareas SET ${campos} WHERE idTarea = ".$data['idTarea'];
    $query = modelNetmex::$database->query($sql);
    return $query;
  }

  public static function get_info($idTarea){
    $filter = "WHERE t.isDelete = 0 ";
    $filter .= $idTarea ? "AND t.idTarea = ${idTarea} " : "";
    $sql = "
            SELECT *
            FROM tareas t
            ${filter}
           ";
    $query = modelNetmex::$database->query($sql);
    if (isset($query->num_rows) && $query->num_rows) {
      while ($rows = $query->fetch_assoc()) {
        modelNetmex::$data[] = $rows;
      }
      modelNetmex::$data["msj"] = "Se obtuvieron resultados";
    }
    return modelNetmex::$data;
  }

}


 ?>
