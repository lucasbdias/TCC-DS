<?php
header("Access-Control-Allow-Origin: *");

function error($message){
    $response["status"] = 0;   
    $response["error"] = $message;    
    arrayJSON($response);    
}

function arrayJSON($response){
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

$response = array();
extract($_POST);
if(!isset($type)){
   error("Requisição Inválida");
}
include_once "conexao.php";


if($type == "cadastrar_post"){
    include_once "functions.php";
    include_once "verificar.php";
    $imagem = $_FILES["foto"]; 


    if(!verificarTexto($nome, 3))
        error("Preencher o nome completo");

    if(!verificarTexto($descricao, 20))
        error("A descrição deve conter pelo menos 5 palavras");

    if(validarImagem($imagem)){
        $nomeImagem = enviarImagem($imagem);
        $imagemResize = resize("imagens/".$nomeImagem, 400, 400, true);  
        $nomeFinal = "400_".$nomeImagem;          
        imagejpeg($imagemResize, "imagens/".$nomeFinal);
        unlink("imagens/".$nomeImagem);
        $criador = $_COOKIE['iduser'];
        $sql = "INSERT INTO post VALUES(0, :nome, :img, :descricao, :visualizacao, :criador)";            
        $command = $con->prepare($sql);
        $command->bindParam(":nome", $nome);
        $command->bindParam(":img", $nomeFinal);
        $command->bindParam(":descricao", $descricao);
        $command->bindParam(":visualizacao", $visualizacao);
        $command->bindParam(":criador", $criador);
        if($command->execute()){
            $response["status"] = 1;
            arrayJSON($response);
        }else{
            error("Erro ao cadastrar o POST, verifique as informações"." NOME-> ".$nome." NOME FINAL-> ".$nomeFinal." DESCRICAO-> ".$descricao." visualizacao-> ".$visualizacao." CRIADOR-> ".$criador);
        }
    }
    else{
        error("Imagem inválida, escolha outra!");
    }        
}

else if($type == "listar_post"){
   $sql = "SELECT * FROM post";
   $command = $con->prepare($sql);
   // $nome = "%".$nome."%";
   // $command->bindParam(":nome", $nome);
   $command->execute();
   $data = $command->fetchAll();
   arrayJSON($data);
}

else if($type == "listar_post_cliente"){
   $sql = "SELECT * FROM post WHERE visualizacao = 1";
   $command = $con->prepare($sql);
   // $nome = "%".$nome."%";
   // $command->bindParam(":nome", $nome);
   $command->execute();
   $data = $command->fetchAll();
   arrayJSON($data);
}

else if($type == "excluir_post"){
    if(isset($idpost) && isset($foto)){
        $sql = "DELETE FROM post WHERE idpost=:id";
        $command = $con->prepare($sql);        
        $command->bindParam(":id", $idpost);
        if($command->execute()){
            unlink("imagens/".$foto);
            $response["status"] = 1;
            arrayJSON($response);
        }
        else{
            error("Erro ao excluir!");
        }            
    }else{
        error("Erro ao excluir! É necessário o ID para exclusão.");
    }
}
else if($type=="consultar_post"){
    if(isset($idpost)){
        $sql = "SELECT * FROM post WHERE idpost = :idpost";
        $command = $con->prepare($sql);            
        $command->bindParam(":idpost", $idpost);
        $command->execute();
        $data = $command->fetch();            
        if(!$data){
            error("Erro ao consultar! Esse ID não existe!");
        }else{
            $data["status"] = 1; 
            arrayJSON($data);
        }            
    }else{
        error("Erro ao consultar! É necessário o ID do produto.");
    }
}

else if($type == "alterar_post"){
    include_once "functions.php";
    include_once "verificar.php";
    $trocarFoto = true;        
    if($_FILES['foto']['size'] == 0 && $_FILES['foto']['error'] == 4){
        $trocarFoto = false;
    }

    if(!verificarTexto($nome, 3))
        error("Preencher o nome completo");

    if(!verificarTexto($descricao, 20))
        error("A descrição deve conter pelo menos 5 palavras");

    $nomeFinal = "";
    $imagem = $_FILES["foto"]; 
    $imagemValida = validarImagem($imagem);        
    if($trocarFoto && $imagemValida){
        $nomeImagem = enviarImagem($imagem);
        $imagemResize = resize("imagens/".$nomeImagem, 400, 400, true);  
        $nomeFinal = "400_".$nomeImagem;          
        imagejpeg($imagemResize, "imagens/".$nomeFinal);
        unlink("imagens/".$nomeImagem);           
    }
    if($trocarFoto && !$imagemValida){
        error("Imagem inválida, escolha outra!");
    }else{
        if(!$trocarFoto){
            $sql = "UPDATE post SET nome=:nome, descricao=:descricao, visualizacao=:visualizacao WHERE idpost=:idpost";            
        }else{
            $sql = "UPDATE post SET nome=:nome, img=:foto, descricao=:descricao, visualizacao=:visualizacao WHERE idpost=:idpost";            
        }            
        $command = $con->prepare($sql);
        $command->bindParam(":nome", $nome);
        $command->bindParam(":descricao", $descricao);
        $command->bindParam(":visualizacao", $visualizacao);
        if($trocarFoto){
            $command->bindParam(":foto", $nomeFinal);
        }
        $command->bindParam(":idpost", $idpost);
        if($command->execute()){
            $response["status"] = 1;
            arrayJSON($response);
        }else{
            error("Erro ao alterar o post, verifique as informações");
        }
    }   
}

?>