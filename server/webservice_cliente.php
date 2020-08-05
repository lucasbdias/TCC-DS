<?php
header("Access-Control-Allow-Origin: *");
function error($mensagem) {
    $resposta['status'] = false;
    $resposta['error'] = $mensagem;
    arrayJSON($resposta);
    exit;
}

function arrayJSON($resposta) {
    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
}

$tipo = htmlentities($_REQUEST['tipo']); 
$resposta = array();
if (!isset($_REQUEST['tipo'])) {
    error("Tipo inexistente");
}
require_once("conexao.php");
require_once("verificar.php");
switch ($tipo) {
case 'cadastrar':
	$codigo = $_REQUEST["codigo"];
	$nome = htmlentities($_POST['txtnome']);
	$area = htmlentities($_POST['txtarea']);
	$email = htmlentities($_POST['txtemail']);
	$senha = htmlentities($_POST['txtsenha']);	
    if(!verificarTamanho($nome, 3))
		$retorno["erros"][] = "Nome do cliente inválido.";

	if(!verificarArea($area))
		$retorno["erros"][] = "Área invalida.";

	if(!verificarEmail($email))
		$retorno["erros"][] = "Preencha o email corretamente.";

	if(!verificarTamanho($senha, 6))
		$retorno["erros"][] = "senha inválido";
    
	$situacao = !isset($retorno["erros"]);


	if($situacao) {
		$sql = "INSERT INTO cliente VALUES(0, :nome, :area_atuacao, :email, sha1(:senha), null)";

		$comando = $con->prepare($sql);

		$comando->bindParam(":nome", $nome);
		$comando->bindParam(":area_atuacao", $area);
		$comando->bindParam(":email", $email);
		$comando->bindParam(":senha", $senha);
		
		
		if ($comando->execute()) 
		{
			$retorno["sucesso"][] = "Cadastro realizado com sucesso.";
			arrayJSON($retorno); 
		}
		else
		{
			$retorno["erros"][] = "Erro ao realizar cadastro.";
			arrayJSON($retorno); 
		}
	}
	else
	{
		$retorno["situacao"] = false;
		arrayJSON($retorno);
	}
break;
    
case 'excluir':
	$codigo = $_REQUEST["codigo"];
	$sql = "DELETE FROM cliente WHERE idcliente = :codigo";

	$comando = $con->prepare($sql);
	$comando->bindParam(":codigo", $codigo);

	if ($comando->execute()) 
	{
		$retorno["sucesso"][] = "excluido com sucesso.";
		echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
	}
	else
	{
		$retorno["erros"][] = "Erro ao excluir cadastro.";
		echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
	}
break;

case 'consultar':
	$codigo = $_REQUEST["codigo"];
	$sql = "SELECT * FROM cliente WHERE idcliente = :codigo";
	$comando = $con->prepare($sql);
	$comando->bindParam(":codigo", $codigo);

	if ($comando->execute()) 
	{
		$dados = $comando->fetch();
		echo json_encode($dados, JSON_UNESCAPED_UNICODE);
	}
	else
	{
		$retorno["erros"][] = "Falha ao resgatar dados.";
		echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
	}
break;
    
case 'alterar':
	$nome = htmlentities($_POST['txtnome']);
	$area = htmlentities($_POST['txtarea']);
	$email = htmlentities($_POST['txtemail']);
	$senha = htmlentities($_POST['txtsenha']);	
	$codigo = $_REQUEST["codigo"];
    if(!verificarTamanho($nome, 3))
		$retorno["erros"][] = "Nome do cliente inválido.";

	if(!verificarArea($area))
		$retorno["erros"][] = "Área invalida.";

	if(!verificarEmail($email))
		$retorno["erros"][] = "Preencha o email corretamente.";

	if(!verificarTamanho($senha, 6))
		$retorno["erros"][] = "senha inválido";
    
	$situacao = !isset($retorno["erros"]);

	if ($situacao) {
		$sql = "UPDATE cliente SET nome = :nome, area_atuacao = :area, email = :email, senha = sha1(:senha) WHERE idcliente = :codigo";

		$comando = $con->prepare($sql);
		$comando->bindParam(":nome", $nome);
		$comando->bindParam(":area", $area);
		$comando->bindParam(":email", $email);
		$comando->bindParam(":senha", $senha);
		$comando->bindParam(":codigo", $codigo);

		if ($comando->execute()) 
		{
			$retorno["sucesso"][] = "Dados alterados com sucesso.";
			echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
		}
		else
		{
			$retorno["erros"][] = "Erro ao alterar dados, tente novamente.";
			echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
		}
	}
break;
    
case 'listar':
    $sql = "SELECT * FROM cliente";
	$comando = $con->prepare($sql);

	if ($comando->execute()) 
	{
		$dados = $comando->fetchAll();
		echo $json = json_encode($dados, JSON_UNESCAPED_UNICODE);
	}
	else
	{
		$retorno["erros"][] = "Erro ao realizar consulta";
		echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
	}
break;

case 'checkCookie':
    if(isset($_COOKIE["tokenCliente"], $_COOKIE["idcliente"])){
        $sql = "SELECT count(*) as 'qtd' FROM cliente WHERE idcliente=:id AND token=:token";
        $comando = $con->prepare($sql);
        $comando->bindParam(":token", $_COOKIE["tokenCliente"]);
        $comando->bindParam(":id", $_COOKIE["idcliente"]);
        $comando->execute();
        $dados = $comando->fetch();
        $qtd = $dados["qtd"];   
        if ($qtd == 1) {
			$resposta["status"] = true;
			$resposta["idcliente"] = $_COOKIE["idcliente"];
            arrayJSON($resposta);
        } 
    } else {
		error("Cookie invalido");
    }
break;

case 'destruirCookie':
	if (isset($_COOKIE['idcliente']) && isset($_COOKIE['tokenCliente'])) {
		$sql = "UPDATE cliente SET token=:token WHERE idcliente=:id";
		$comando = $con->prepare($sql);
		$comando->bindValue(":token", "");
        $comando->bindParam(":id", $_COOKIE["idcliente"]);
        if ($comando->execute()) {
			unset($_COOKIE['idcliente']); 
			setcookie('idcliente', null, -1, '/');
			unset($_COOKIE['tokenCliente']); 
    		setcookie('tokenCliente', null, -1, '/');
			$resposta['status'] = true;
			echo arrayJSON($resposta);
		}
	} else {
		$resposta['status'] = false;
		echo arrayJSON($resposta);
	}
break;
  
case 'logar': 
        if (isset($_POST['txtemail'], $_POST['txtemail'])) {
            $email = $_POST['txtemail'];
            $senha = $_POST['txtsenha'];

            if (!verificarEmail($email))
                $resposta["erros"][] = "Email errada";
            if(!verificarTxt($senha, 6))
                $resposta["erros"][] = "Senha errada";

            if (!isset($resposta["erros"])) {
                $sql = "SELECT idcliente, count(*) as 'qtd' FROM cliente WHERE email=:email AND senha=sha1(:senha)";
                $comando = $con->prepare($sql);
                $comando->bindParam(":email", $email);
                $comando->bindParam(":senha", $senha);
                $comando->execute();
                $dados = $comando->fetch();
                $qtd = $dados["qtd"];
                if ($qtd == 1) {
                    $sqlToken = "UPDATE cliente SET token=:token WHERE idcliente=:id";
                    $token = bin2hex(openssl_random_pseudo_bytes(32));
                    $comandoToken = $con->prepare($sqlToken);
                    $comandoToken->bindParam(":token", $token);
                    $comandoToken->bindParam(":id", $dados["idcliente"]);
                    if ($comandoToken->execute()) {
                        setcookie("idcliente", $dados["idcliente"], time() + (86400 * 30), "/");
                        setcookie("tokenCliente", $token, time() + (86400 * 30), "/");
                        $resposta["status"] = true;
                        arrayJSON($resposta);
                    } else {
                        error("Erro ao gerar o Token");
                      }
                } else {
                    error("Esta incorreto o email ou senha");
                }
            }
        } else {
            error("É necessário email e senha");
        }
break;
        
default:
    echo "nenhum tipo de requisição";
break;
}	