<?php 

include_once "conexao.php";

extract($_GET);

switch ($tipo) {
	case 'cadastrar':
		$erro = "";
	$partes_nome = explode(" ", $nome);

	//verificação do campo nome
	if(!isset($nome) || empty($nome) || strlen($partes_nome[0]) < 3 || count($partes_nome)<2)
		$erro.= "- Favor digitar seu nome completo";

	//verificação do campo cargo
	if(!isset($cargo) || empty($cargo))
		$erro.= "- área de atuação não especificada";

	//verificação do campo email

	if(!filter_var($email, FILTER_VALIDATE_EMAIL))
		$erro.= "- Email inválido";

	//verificação da senha
	if (strlen($senha) < 6)
		$erro.= "- Senha inválida";

	//confirmação da senha
	if ($confsenha != $senha)
		$erro.= "- Senhas diferentes";

	//Verificação para email já existente
	$sql = "SELECT count(email) FROM usuarioDB WHERE email= :email";

	$comando = $con->prepare($sql);
	$comando->bindParam(":email", $email);
	$comando->execute();
	$dados = $comando->fetch();

	if ($dados[0] > 0) {
		$erro.= " Email já cadastrado";
	}
	
	if ($erro == ""){

		$sql = "INSERT INTO usuarioDB VALUES(0, :nome, :cargo, :email, :senha, null)";
		echo $sql;
		$comando = $con->prepare($sql);
		$comando->bindParam(":nome", $nome);
		$comando->bindParam(":cargo", $cargo);
		$comando->bindParam(":email", $email);
		$comando->bindParam(":senha", $senha);
		if ($comando->execute()) {
			echo 1;
		} else {
			echo "oi";
		}
	}
		
	else
		echo "Os Campos a seguir não foram preenchidos corretamente:".$erro;
	break;
	case 'editar':

	$erro = "";
	$partes_nome = explode(" ", $nome);

	//verificação do campo nome
	if(!isset($nome) || empty($nome) || strlen($partes_nome[0]) < 3 || count($partes_nome)<2)
		$erro.= "- Favor digitar seu nome corretamente";

	//verificação do campo cargo
	if(!isset($cargo) || empty($cargo))
		$erro.= "- Cargo não especificada";

	//verificação do campo email
	if (!isset($email) || empty($email))
		$erro.= "- Email";

	//verificação da senha
	if (strlen($senha) < 6)
		$erro.= "- Senha inválida";

	//confirmação da senha
	if ($confsenha != $senha)
		$erro.= "- Confirme sua Senhas";


	if ($erro == ""){

		$sql = "UPDATE usuarioDB SET nome = :nome, cargo = :cargo, email = :email, senha = :senha WHERE iduser= :iduser";

		$comando = $con->prepare($sql);
		$comando->bindParam(":nome", $nome);
		$comando->bindParam(":cargo", $cargo);
		$comando->bindParam(":email", $email);
		$comando->bindParam(":senha", $senha);
		$comando->bindParam(":iduser", $iduser);
		$comando->execute();
	}
	
	else
		echo "Os Campos a seguir não foram preenchidos corretamente:".$erro;
	break;
	case 'consulta':
		$sql = "SELECT * FROM usuarioDB";

	$comando = $con->prepare($sql);
	$comando->execute();
	$dados= $comando->fetch();

	$json = json_encode($dados,JSON_UNESCAPED_UNICODE);

	echo $json;
	break;
	case 'excluir':
		$sql = "DELETE FROM usuarioDB WHERE iduser=:iduser";

		$comando = $con->prepare($sql);
		$comando->bindParam(":iduser", $iduser);
		$comando->execute();
	break;
	case 'puxar':
		$sql = "SELECT * FROM usuarioDB WHERE iduser=$iduser";

	$comando = $con->prepare($sql);
	$comando->bindParam(":iduser", $iduser);
	$comando->execute();
	$dados= $comando->fetch();

	$json = json_encode($dados,JSON_UNESCAPED_UNICODE);

	echo $json;
	break;
	case 'login_user':
		$resposta = array();

		$erro = "";

		if (!isset($email) || empty($email))
			$erro.= "Favor digitar um Email válido";

		if (!isset($senha) || empty($senha) || strlen($senha) < 6)
			$erro.= "A Senha deve ter mais de 6 caracteres";

		if ($erro == "") {
			$sql = "SELECT iduser, count(*) as 'qtd' FROM usuariodb WHERE email=:email AND senha=:senha";
			$comando = $con->prepare($sql);
			$comando->bindParam(":email", $email);
			$comando->bindParam(":senha", $senha);
			$comando->execute();
			$dados = $comando->fetch();
			$qtd = $dados["qtd"];
			if ($qtd == 1) {
				$sqlToken = "UPDATE usuariodb SET token=:token WHERE iduser=:id";
				$token = bin2hex(openssl_random_pseudo_bytes(32));
				$comandoToken = $con->prepare($sqlToken);
				$comandoToken->bindParam(":token", $token);
				$comandoToken->bindParam(":id", $dados["iduser"]);
				if ($comandoToken->execute()) {
					setcookie("iduser", $dados["iduser"], time() + (86400 * 30), "/");
					setcookie("token", $token, time() + (86400 * 30), "/");
					$resposta["status"] = true;
					echo json_encode($resposta,JSON_UNESCAPED_UNICODE); 
				} else {
					error("Erro ao gerar o Token");
				  }
			} else {
				error("Esta incorreto o email ou senha");
			}
		}
	break;
	case 'destruirCookie':
		$resposta = array();
	if (isset($_COOKIE['iduser']) && isset($_COOKIE['token'])) {
		$sql = "UPDATE usuarioDB SET token=:token WHERE iduser=:id";
		$comando = $con->prepare($sql);
		$comando->bindValue(":token", "");
        $comando->bindParam(":id", $_COOKIE["iduser"]);
        if ($comando->execute()) {
			unset($_COOKIE['iduser']); 
			setcookie('iduser', null, -1, '/');
			unset($_COOKIE['token']); 
    		setcookie('token', null, -1, '/');
			$resposta['status'] = true;
			echo json_encode($resposta);
		}
	} 
	break;
	case 'checkCookie':
		$erro = "";
	$resposta = array();
	if(isset($_COOKIE["token"], $_COOKIE["iduser"])){
        $sql = "SELECT count(*) as 'qtd' FROM usuariodb WHERE iduser=:id AND token=:token";
        $comando = $con->prepare($sql);
        $comando->bindParam(":token", $_COOKIE["token"]);
        $comando->bindParam(":id", $_COOKIE["iduser"]);
        $comando->execute();
        $dados = $comando->fetch();
        $qtd = $dados["qtd"];   
        if ($qtd == 1) {
			$resposta["status"] = true;
			$resposta["iduser"] = $_COOKIE["iduser"];
			echo json_encode($resposta);
		} else {
			$resposta["status"] = false;
			echo json_encode($resposta);
		}
	} 
	
	else {
		$resposta["status"] = false;
		echo json_encode($resposta);
    }
	break;
}

/*if($tipo=="cadastrar") {
	
	$erro = "";
	$partes_nome = explode(" ", $nome);

	//verificação do campo nome
	if(!isset($nome) || empty($nome) || strlen($partes_nome[0]) < 3 || count($partes_nome)<2)
		$erro.= "- Favor digitar seu nome completo";

	//verificação do campo cargo
	if(!isset($cargo) || empty($cargo))
		$erro.= "- área de atuação não especificada";

	//verificação do campo email

	if(!filter_var($email, FILTER_VALIDATE_EMAIL))
		$erro.= "- Email inválido";

	//verificação da senha
	if (strlen($senha) < 6)
		$erro.= "- Senha inválida";

	//confirmação da senha
	if ($confsenha != $senha)
		$erro.= "- Senhas diferentes";

	//Verificação para email já existente
	$sql = "SELECT count(email) FROM usuarioDB WHERE email= :email";

	$comando = $con->prepare($sql);
	$comando->bindParam(":email", $email);
	$comando->execute();
	$dados = $comando->fetch();

	if ($dados[0] > 0) {
		$erro.= " Email já cadastrado";
	}
	
	if ($erro == ""){

		$sql = "INSERT INTO usuarioDB VALUES(0, :nome, :cargo, :email, :senha, null)";
		echo $sql;
		$comando = $con->prepare($sql);
		$comando->bindParam(":nome", $nome);
		$comando->bindParam(":cargo", $cargo);
		$comando->bindParam(":email", $email);
		$comando->bindParam(":senha", $senha);
		if ($comando->execute()) {
			echo 1;
		} else {
			echo "oi";
		}
	}
		
	else
		echo "Os Campos a seguir não foram preenchidos corretamente:".$erro;
}


else if($tipo=="editar") {

	$erro = "";
	$partes_nome = explode(" ", $nome);

	//verificação do campo nome
	if(!isset($nome) || empty($nome) || strlen($partes_nome[0]) < 3 || count($partes_nome)<2)
		$erro.= "- Favor digitar seu nome corretamente";

	//verificação do campo cargo
	if(!isset($cargo) || empty($cargo))
		$erro.= "- Cargo não especificada";

	//verificação do campo email
	if (!isset($email) || empty($email))
		$erro.= "- Email";

	//verificação da senha
	if (strlen($senha) < 6)
		$erro.= "- Senha inválida";

	//confirmação da senha
	if ($confsenha != $senha)
		$erro.= "- Confirme sua Senhas";


	if ($erro == ""){

		$sql = "UPDATE usuarioDB SET nome = :nome, cargo = :cargo, email = :email, senha = :senha WHERE iduser= :iduser";

		$comando = $con->prepare($sql);
		$comando->bindParam(":nome", $nome);
		$comando->bindParam(":cargo", $cargo);
		$comando->bindParam(":email", $email);
		$comando->bindParam(":senha", $senha);
		$comando->bindParam(":iduser", $iduser);
		$comando->execute();
	}
	
	else
		echo "Os Campos a seguir não foram preenchidos corretamente:".$erro;
		
}

elseif ($tipo == "consulta"){
		
	$sql = "SELECT * FROM usuarioDB";

	$comando = $con->prepare($sql);
	$comando->execute();
	$dados= $comando->fetch();

	$json = json_encode($dados,JSON_UNESCAPED_UNICODE);

	echo $json;

}

elseif ($tipo == "excluir"){

	$sql = "DELETE FROM usuarioDB WHERE iduser=:iduser";

	$comando = $con->prepare($sql);
	$comando->bindParam(":iduser", $iduser);
	$comando->execute();
}


elseif ($tipo == "puxar"){

	$sql = "SELECT * FROM usuarioDB WHERE iduser=$iduser";

	$comando = $con->prepare($sql);
	$comando->bindParam(":iduser", $iduser);
	$comando->execute();
	$dados= $comando->fetch();

	$json = json_encode($dados,JSON_UNESCAPED_UNICODE);

	echo $json;

}

else if($tipo == "login_user"){
		$resposta = array();

		$erro = "";

		if (!isset($email) || empty($email))
			$erro.= "Favor digitar um Email válido";

		if (!isset($senha) || empty($senha) || strlen($senha) < 6)
			$erro.= "A Senha deve ter mais de 6 caracteres";

		if ($erro == "") {
			$sql = "SELECT iduser, count(*) as 'qtd' FROM usuariodb WHERE email=:email AND senha=:senha";
			$comando = $con->prepare($sql);
			$comando->bindParam(":email", $email);
			$comando->bindParam(":senha", $senha);
			$comando->execute();
			$dados = $comando->fetch();
			$qtd = $dados["qtd"];
			if ($qtd == 1) {
				$sqlToken = "UPDATE usuariodb SET token=:token WHERE iduser=:id";
				$token = bin2hex(openssl_random_pseudo_bytes(32));
				$comandoToken = $con->prepare($sqlToken);
				$comandoToken->bindParam(":token", $token);
				$comandoToken->bindParam(":id", $dados["iduser"]);
				if ($comandoToken->execute()) {
					setcookie("iduser", $dados["iduser"], time() + (86400 * 30), "/");
					setcookie("token", $token, time() + (86400 * 30), "/");
					$resposta["status"] = true;
					echo json_encode($resposta,JSON_UNESCAPED_UNICODE); 
				} else {
					error("Erro ao gerar o Token");
				  }
			} else {
				error("Esta incorreto o email ou senha");
			}
		}
}

else if ($tipo = "destruirCookie") {
	$resposta = array();
	if (isset($_COOKIE['iduser']) && isset($_COOKIE['token'])) {
		$sql = "UPDATE usuarioDB SET token=:token WHERE iduser=:id";
		$comando = $con->prepare($sql);
		$comando->bindValue(":token", "");
        $comando->bindParam(":id", $_COOKIE["iduser"]);
        if ($comando->execute()) {
			unset($_COOKIE['iduser']); 
			setcookie('iduser', null, -1, '/');
			unset($_COOKIE['token']); 
    		setcookie('token', null, -1, '/');
			$resposta['status'] = true;
			echo json_encode($resposta);
		}
	} 
}

else if ($tipo = "checkCookie") {
	$erro = "";
	$resposta = array();
	if(isset($_COOKIE["token"], $_COOKIE["iduser"])){
        $sql = "SELECT count(*) as 'qtd' FROM usuariodb WHERE iduser=:id AND token=:token";
        $comando = $con->prepare($sql);
        $comando->bindParam(":token", $_COOKIE["token"]);
        $comando->bindParam(":id", $_COOKIE["iduser"]);
        $comando->execute();
        $dados = $comando->fetch();
        $qtd = $dados["qtd"];   
        if ($qtd == 1) {
			$resposta["status"] = true;
			$resposta["iduser"] = $_COOKIE["iduser"];
			echo json_encode($resposta);
		} else {
			$resposta["status"] = false;
			echo json_encode($resposta);
		}
	} 
	
	else {
		$resposta["status"] = false;
		echo json_encode($resposta);
    }
}*/

 ?>