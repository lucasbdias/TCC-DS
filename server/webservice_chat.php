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
    case 'consultaCliente':
        $idcliente = $_POST['id'];

        $sqlConsultaCliente = "SELECT nome FROM cliente WHERE idcliente = :idcliente";
        $comando = $con->prepare($sqlConsultaCliente);
        $comando->bindParam(":idcliente", $idcliente);
        if ($comando->execute()) {
            $dados = $comando->fetch(PDO::FETCH_ASSOC);
            echo json_encode($dados, JSON_UNESCAPED_UNICODE);
        }
    break;

    case 'novaConversa':
        $msg = $_POST['txtmsg'];
        $nome = $_POST['txtnome'];
        $conversa = ["0"=> ["nome"=>$nome, "msg"=>$msg, "horario"=>date('h:i')]];
        var_dump($conversa);

        $sql = "INSERT INTO mensagem VALUES(0, :fkcliente, :msg, 0)";
        $comando = $con->prepare($sql);
        $comando->bindParam(":fkcliente", $_COOKIE["idcliente"]);
        $comando->bindParam(":msg", json_encode($conversa, JSON_UNESCAPED_UNICODE));
        if ($comando->execute()) {
            $retorno["sucesso"][] = "Cadastro realizado com sucesso.";
			echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        } else {
            $retorno["erros"][] = "Erro ao realizar cadastro.";
            echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        }
    break;

    case 'listarConversa':
        $sql = "SELECT idmensagem, msg, stat FROM mensagem WHERE stat = 0 and fkcliente=:idcliente";
        $comando = $con->prepare($sql);
        $comando->bindParam(":idcliente", $_COOKIE["idcliente"]);
        
        if ($comando->execute()) {
            $dados = $comando->fetch(PDO::FETCH_ASSOC);
            echo $dados["msg"] . "_" . $dados["idmensagem"] . "_" . $dados["stat"];
        } else {
            $retorno["erros"][] = "Erro ao realizar consulta";
		    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        }
    break;

    case 'listarConversa2':
        $sql = "SELECT msg FROM mensagem WHERE fkcliente=:idcliente";
        $comando = $con->prepare($sql);
        $comando->bindParam(":idcliente", $_COOKIE["idcliente"]);
        
        if ($comando->execute()) {
            $dados = $comando->fetch(PDO::FETCH_ASSOC);
            echo $dados["msg"];
        } else {
            $retorno["erros"][] = "Erro ao realizar consulta";
		    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        }
    break;

    case 'ultimaMsg':
        $sql = "SELECT msg FROM mensagem WHERE fkcliente=:idcliente";
        $comando = $con->prepare($sql);
        $comando->bindParam(":idcliente", $_COOKIE["idcliente"]);

        if ($comando->execute()) {
            $dados = $comando->fetch(PDO::FETCH_ASSOC);
            echo $json = json_encode($dados, JSON_UNESCAPED_UNICODE);
        } else {
            $retorno["erros"][] = "Erro ao realizar consulta";
            echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        }
    break;

    case 'ultimaMsg2':
        $idmensagem = $_REQUEST['id'];
        $sql = "SELECT msg FROM mensagem WHERE idmensagem=:idmensagem";
        $comando = $con->prepare($sql);
        $comando->bindParam(":idmensagem", $idmensagem);

        if ($comando->execute()) {
            $dados = $comando->fetch(PDO::FETCH_ASSOC);
            echo $json = json_encode($dados, JSON_UNESCAPED_UNICODE);
        } else {
            $retorno["erros"][] = "Erro ao realizar consulta";
            echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        }
    break;

    case 'repostaConversa':
        $msg = $_POST['txtmsg'];
        $nome = $_POST['txtnome'];
        $idmensagem = $_POST['id'];

        $sqlConsulta = "SELECT msg FROM mensagem WHERE idmensagem = :idmensagem";
        $comandoConsulta = $con->prepare($sqlConsulta);
        $comandoConsulta->bindParam(":idmensagem", $idmensagem);
        if ($comandoConsulta->execute()) {
            $dados = $comandoConsulta->fetch(PDO::FETCH_ASSOC);
        }
        $assocArray = json_decode($dados["msg"], true);
        $conversa = ["nome"=>$nome, "msg"=>$msg, "horario"=>date('h:i')];
        array_push($assocArray, $conversa);
        $msgFinal = json_encode($assocArray, JSON_UNESCAPED_UNICODE);
        
        $sqlAlterar = "UPDATE mensagem SET msg = :msg WHERE idmensagem = :idmensagem";
        $comando = $con->prepare($sqlAlterar);
        $comando->bindParam(":msg", $msgFinal);
        $comando->bindParam(":idmensagem", $idmensagem);

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
    break;

    case "finalizarConversa":
        $idmensagem = $_POST['id'];
        $sql = "UPDATE mensagem SET stat = :stat where idmensagem = :idmensagem";
        $comando = $con->prepare($sql);
        $comando->bindValue(":stat", 1);
        $comando->bindParam(":idmensagem", $idmensagem);
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
    break;

    case 'listarConversaAberta':
        $sql = "SELECT idmensagem, msg FROM mensagem WHERE stat = 0";
        $comando = $con->prepare($sql);
        $comando->bindParam(":idcliente", $_COOKIE["idcliente"]);
        
        if ($comando->execute()) {
            $dados = $comando->fetchAll(PDO::FETCH_ASSOC);
            //echo $dados["msg"] . "_" . $dados["idmensagem"] . "_" . $dados["stat"];
            echo json_encode($dados);
        } else {
            $retorno["erros"][] = "Erro ao realizar consulta";
		    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        }
    break;

    case 'qtdConversasAberta':
        $sql = "SELECT count(*) as 'qtd' FROM mensagem WHERE stat = 0"; 
        $comando = $con->prepare($sql);
        
        if ($comando->execute()) {
            $dados = $comando->fetch(PDO::FETCH_ASSOC);
            //echo $dados["msg"] . "_" . $dados["idmensagem"] . "_" . $dados["stat"];
            echo json_encode($dados);
        } else {
            $retorno["erros"][] = "Erro ao realizar consulta";
		    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        }
    break;

    case 'listarConversaAdm':
        $sql = "SELECT idmensagem, msg, stat FROM mensagem WHERE stat = 0 and idmensagem=:idmensagem";
        $comando = $con->prepare($sql);
        $comando->bindParam(":idmensagem", $_POST["id"]);
        
        if ($comando->execute()) {
            $dados = $comando->fetch(PDO::FETCH_ASSOC);
            echo $dados["msg"] . "_" . $dados["idmensagem"] . "_" . $dados["stat"];
        } else {
            $retorno["erros"][] = "Erro ao realizar consulta";
		    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
        }
    break;

    default:
        echo "nenhum tipo de requisição";
    break;
}