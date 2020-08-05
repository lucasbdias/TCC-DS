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


if($type == "cadastrar_produto"){
    include_once "functions.php";
    include_once "verificar.php";
    $imagem = $_FILES["foto"]; 


    if(!verificarTexto($nome, 3))
        error("Preencher o nome completo");

    if(!verificarTexto($descricao, 20))
        error("A descrição deve conter pelo menos 5 palavras");

    if(!verificarTexto($cor, 3))
        error("informe uma cor válida.");

    if(!verificarNum($peso, 0))
        error("informe o peso corretamente");

    if(!verificarTexto($link, 10))
        error("O link deve conter ao menos 10 caracteres.");


    if(validarImagem($imagem)){
        $nomeImagem = enviarImagem($imagem);
        $imagemResize = resize("imagens/".$nomeImagem, 400, 400, true);  
        $nomeFinal = "400_".$nomeImagem;          
        imagejpeg($imagemResize, "imagens/".$nomeFinal);
        unlink("imagens/".$nomeImagem);
        $sql = "INSERT INTO produto VALUES(0, :nome, :img, :descricao, :cor, :peso, :link_compra)";            
        $command = $con->prepare($sql);
        $command->bindParam(":nome", $nome);
        $command->bindParam(":img", $nomeFinal);
        $command->bindParam(":descricao", $descricao);
        $command->bindParam(":cor", $cor);
        $command->bindParam(":peso", $peso);
        $command->bindParam(":link_compra", $link);
        if($command->execute()){
            $response["status"] = 1;
            arrayJSON($response);
        }else{
            error("Erro ao cadastrar o produto, verifique as informações");
        }
    }
    else{
        error("Imagem inválida, escolha outra!");
    }        
}

else if($type == "listar_produto"){
   $sql = "SELECT * FROM produto";
   $command = $con->prepare($sql);
   // $nome = "%".$nome."%";
   // $command->bindParam(":nome", $nome);
   $command->execute();
   $data = $command->fetchAll();
   arrayJSON($data);
}

else if($type == "excluir_produto"){
    if(isset($idproduto) && isset($foto)){
        $sql = "DELETE FROM produto WHERE idproduto=:id";
        $command = $con->prepare($sql);        
        $command->bindParam(":id", $idproduto);
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
else if($type=="consultar_produto"){
    if(isset($idproduto)){
        $sql = "SELECT * FROM produto WHERE idproduto = :idproduto";
        $command = $con->prepare($sql);            
        $command->bindParam(":idproduto", $idproduto);
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

else if($type == "alterar_produto"){
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

    if(!verificarTexto($cor, 3))
        error("informe uma cor válida.");

    if(!verificarNum($peso, 0))
        error("informe o peso corretamente");

    if(!verificarTexto($link, 10))
        error("O link deve conter ao menos 10 caracteres.");

    $nomeFinal = "";
    $imagem = $_FILES["foto"]; 
    $imagemValida = validarImagem($imagem);        
    if($trocarFoto && $imagemValida){
        $nomeImagem = enviarImagem($imagem);
        $imagemResize = resize("imagens/".$nomeImagem, 200, 200, true);  
        $nomeFinal = "200_".$nomeImagem;          
        imagejpeg($imagemResize, "imagens/".$nomeFinal);
        unlink("imagens/".$nomeImagem);           
    }
    if($trocarFoto && !$imagemValida){
        error("Imagem inválida, escolha outra!");
    }else{
        if(!$trocarFoto){
            $sql = "UPDATE produto SET nome=:nome, descricao=:descricao, cor=:cor, peso=:peso, link_compra=:link_compra WHERE idproduto=:idproduto";            
        }else{
            $sql = "UPDATE produto SET nome=:nome, img=:foto, descricao=:descricao, cor=:cor, peso=:peso, link_compra=:link_compra WHERE idproduto=:idproduto";            
        }            
        $command = $con->prepare($sql);
        $command->bindParam(":nome", $nome);
        $command->bindParam(":descricao", $descricao);
        $command->bindParam(":cor", $cor);
        $command->bindParam(":peso", $peso);
        $command->bindParam(":link_compra", $link);
        if($trocarFoto){
            $command->bindParam(":foto", $nomeFinal);
        }
        $command->bindParam(":idproduto", $idproduto);
        if($command->execute()){
            $response["status"] = 1;
            arrayJSON($response);
        }else{
            error("Erro ao alterar o produto, verifique as informações");
        }
    }   
}

?>