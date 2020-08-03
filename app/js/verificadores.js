//DevMedia
function verificarCpf(strCPF) {
  var Soma;
  var Resto;
  Soma = 0;
if (strCPF == "00000000000") return false;
   
for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
Resto = (Soma * 10) % 11;
 
  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
 
Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;
 
  if ((Resto == 10) || (Resto == 11))  Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
  return true;
}

function verificarTxt(valor, qtd){
  return valor.length == qtd;
}

function verificarCampo(valor, qtd){
  return valor.length >= qtd;
}

function verificarEmail(email){
  if(email.split(" ").length>1)
    return false;
  let partes = email.split("@");
  if(partes.length == 2){
    return partes[1].split(".").length>1;
  }
  else{
    return false;
  }
}

function verificarArea(area) {
switch (area) {
  case "1":
    return "odontologia";
  break;

  case "2":
    return "joalheria";
  break;

  case "3":
    return "engenharia";
  break;

  case "4":
    return "outra area"
  break;

  default:
    return false;
  break;
}
}


function getCookie(cname) {
var name = cname + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for(var i = 0; i <ca.length; i++) {
  var c = ca[i];
  while (c.charAt(0) == ' ') {
    c = c.substring(1);
  }
  if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
  }
}
return "";
}


//Verificar tamanho da string
function verificarTexto(valor, tamanho)
{
    return valor.length > tamanho;
}

//Verificar se é numero e o tamanho da string
function verificarNum(valor, tamanho)
{
    return !isNaN(valor) && valor.length > tamanho;
}

//Verificar quantidade de palavras
function verificarPalavras(valor)
{
  return (valor.split(" ").length>5);

}
