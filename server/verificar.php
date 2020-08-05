<?php 

//Verificar sé é numero e o numero de valores digitados
function verificarNum($valor, $tamanho)
{
	return (is_numeric($valor) && (strlen($valor) > $tamanho));
}

//Verificar se foi digitado algum valor e o seu tamanho
function verificarTexto($valor, $tamanho)
{
    return (strlen($valor) > $tamanho);
}

function verificarTxt($valor, $tamanho) {
	return strlen($valor) == $tamanho;
}

function verificarTamanho($valor, $tamanho) {
  if(strlen($valor) >= $tamanho)
    return true;
}

function verificarTipoValor($valor, $tipoValor) {
    if (gettype($valor) == $tipoValor)
        return true;
}

function verificarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function verificarArea($area) {
    switch ($area) {
      case "odontologia":
        return true;
      break;
  
      case "joalheria":
        return true;
      break;
  
      case "engenharia":
        return true;
      break;
  
      case "outra area":
        return true;
      break;
    
      default:
        return false;
      break;
    }
  }

?>