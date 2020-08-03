function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
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

$(document).ready(function(){
    $('select').formSelect();
    $('.materialboxed').materialbox();
    $('.sidenav').sidenav();
    $('.modal').modal();
    $('.datepicker').datepicker();
});

var url = "http://localhost/MakerTech/server/webservice_produto.php";
var url_post = "http://localhost/MakerTech/server/webservice_post.php";
var url_imagens  = "http://localhost/MakerTech/server/imagens/";
var url_cliente = "http://localhost/MakerTech/server/webservice_cliente.php";
var url_chat = "http://localhost/MakerTech/server/webservice_chat.php";