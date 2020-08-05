<?php 

header("Access-Control-Allow-Origin: *");

include_once "../server/conexao.php";

extract($_GET);

if($tipo == "cadastrar") {

	$dataC = explode('-', $data_criacao);
	$dataE = explode('-', $data_expdicao);
	$erro = "";

	//verificação do campo titulo
	if(!isset($titulo) || empty($titulo))
		$erro.= "- Favor digitar o titulo corretamente";

	//verificação do campo código
	if(!isset($codigo) || empty($codigo) || strlen($codigo)!=6)
		$erro.= "- Favor digitar o código com 6 caracteres";

	//verificação do data de criação
	if (!isset($data_criacao) || empty($data_criacao) || !checkdate ($dataC[1] , $dataC[2] , $dataC[0]))
		$erro.= "- Favor digitar uma data de criação válida";

	//verificação do data de expedição
	if (!isset($data_expdicao) || empty($data_expdicao) || !checkdate ($dataE[1] , $dataE[2] , $dataE[0]))
		$erro.= "- Favor digitar uma data de expedição válida";


	if ($erro == ""){

		$sql = "INSERT INTO cupom VALUES(0, :titulo, :codigo, :data_criacao, :data_expdicao, 0)";

		$comando = $con->prepare($sql);
		$comando->bindParam(":titulo", $titulo);
		$comando->bindParam(":codigo", $codigo);
		$comando->bindParam(":data_criacao", $data_criacao);
		$comando->bindParam(":data_expdicao", $data_expdicao);

		if ($comando->execute()){
			echo "Sucesso: "."Titulo: ".$titulo." Codigo: ".$codigo." Data criação:".$data_criacao." Data expedição: ".$data_expdicao;
			return;
		}
		else{
			echo "Falha: "."Titulo: ".$titulo." Codigo: ".$codigo." Data criação:".$data_criacao." Data expedição: ".$data_expdicao;
			return;
		}
		
	}
		
	else
		echo "Os Campos a seguir não foram preenchidos corretamente:".$erro;
}


else if($tipo=="editar") {

	$dataC = explode('-', $data_criacao);
	$dataE = explode('-', $data_expdicao);
	$erro = "";

	//verificação do campo titulo
	if(!isset($titulo) || empty($titulo))
		$erro.= "- Favor digitar o titulo corretamente";

	//verificação do campo código
	if(!isset($codigo) || empty($codigo) || strlen($codigo)!=6)
		$erro.= "- Favor digitar o código com 6 caracteres";

	//verificação do data de criação
	if (!isset($data_criacao) || empty($data_criacao) || !checkdate ($dataC[1] , $dataC[2] , $dataC[0]))
		$erro.= "- Favor digitar uma data de criação válida";

	//verificação do data de expedição
	if (!isset($data_expdicao) || empty($data_expdicao) || !checkdate ($dataE[1] , $dataE[2] , $dataE[0]))
		$erro.= "- Favor digitar uma data de expedição válida";


	if ($erro == ""){

		$sql = "UPDATE cupom SET titulo = :titulo, codigo = :codigo, data_criacao = :data_criacao, data_expdicao = :data_expdicao WHERE idcupons=:idcupons";

		$comando = $con->prepare($sql);
		$comando->bindParam(":titulo", $titulo);
		$comando->bindParam(":codigo", $codigo);
		$comando->bindParam(":data_criacao", $data_criacao);
		$comando->bindParam(":data_expdicao", $data_expdicao);
		$comando->bindParam(":idcupons", $idcupons);
		$comando->execute();
	}
	
	else
		echo "Os Campos a seguir não foram preenchidos corretamente:".$erro;
		
}

elseif ($tipo == "consulta"){
		
	$sql = "SELECT * FROM cupom";

	$comando = $con->prepare($sql);
	$comando->execute();
	$dados = $comando->fetchAll();

	$json = json_encode($dados,JSON_UNESCAPED_UNICODE);

	echo $json;

}

elseif ($tipo == "excluir"){

	$sql = "DELETE FROM cupom WHERE idcupons=:idcupons";

	$comando = $con->prepare($sql);
	$comando->bindParam(":idcupons", $idcupons);
	$comando->execute();
}

elseif ($tipo == "puxar"){

	$sql = "SELECT * FROM cupom WHERE idcupons=:idcupons";

	$comando = $con->prepare($sql);
	$comando->bindParam(":idcupons", $idcupons);
	$comando->execute();
	$dados= $comando->fetch();

	$json = json_encode($dados,JSON_UNESCAPED_UNICODE);

	echo $json;

}

 ?>