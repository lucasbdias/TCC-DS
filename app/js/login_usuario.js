function puxar(iduser){
            
    $.ajax({
        url: "http://localhost/MakerTech/server/webservice_usuario.php",
        method: "get",
        data:{
            "tipo": "puxar",
            "iduser": iduser
        },
        success: function(retorno){
 
            let json = $.parseJSON(retorno);

            $("#iduser").val(json.iduser);
            $("#nome-completo").val(json.nome);
            $("#cargo").val(json.cargo);
            $("#user-email").val(json.email);
            $("#senha1").val(json.senha);
            $("#enviar").val("Alterar");

        },
        timeout: 3000,
        error: function(){
			M.toast({html: 'erro ao realizar requisição'})
            //alert("erro ao realizar requisição");
        }
});
}

function excluir(iduser){

    if(confirm("Deseja realmente excluir")){
        $.ajax({
            url: "http://localhost/MakerTech/server/webservice_usuario.php",
            method: "get",
            data:{
                "tipo": "excluir",
                "iduser": iduser
            },
            success: function(retorno){
                listar();
            },
            timeout: 3000,
            error: function(){
				M.toast({html: 'erro'})
                //alert("erro");
            }
        });
    }
}

function listar(){

    $("#tb").html("");

    $.ajax({
        url: "http://localhost/MakerTech/server/webservice_usuario.php",
        metbod: "get",
        data:{
            "tipo": "consulta"
        },
        success:function(retorno){
            
            let json = $.parseJSON(retorno);
            let x = 0;
            
            for(x = 0; x < json.length; x++){

                let content = `
                    <tr>
                        <td id="id" title="Clique para Editar" onclick="puxar(${json[x].iduser})">${json[x].iduser}</td>
                        <td class="nome">${json[x].nome}</td>
                        <td class="cargo">${json[x].cargo}</td>
                        <td class="email">${json[x].email}</td>
                        <td class="senha">${json[x].senha}</td>
                        <td id="excluir" title="Excluir" onclick="excluir(${json[x].iduser})">X</td>
                    </tr>`;

                $("#tb").append(content);

            }
        },
        timeout: 3000,
        error: function(){
			M.toast({html: 'erro ao encontrar servidor'})
            //alert("erro ao encontrar servidor");
        }
    });
}

$(document).ready(function(){
	$.get("http://localhost/MakerTech/server/webservice_usuario.php", {tipo: "checkCookie"}).done((dados) => {
        
        let json = $.parseJSON(dados);
        if (json.status) {
            window.location = "board/crud_cupom.html";
        }
    });

	$('#logar').click(() => { 
        let email = $('#username').val(); 	
        let senha = $('#password').val();

        $.get("http://localhost/MakerTech/server/webservice_usuario.php",{tipo: "login_user", email: email, senha: senha})
        .done((data) => {
            //console.log(data);
            $.get("http://localhost/makertech/server/webservice_usuario.php", {tipo: "checkCookie"}).done((dados) => {
                console.log(dados);
                let json = $.parseJSON(dados);
                if (json.status) {
                	window.location = "board/crud_cupom.html";
                } else {
					M.toast({html: 'Erro ao Logar, preencha os campos corretamente'})
					//alert("Erro ao Logar, preencha os campos corretamente")
				}
            });
        });
    });


	$("#enviar").click(function(){

		let iduser, nome, cargo, email, senha, confsenha;

	    iduser = $("#iduser").val();
	    nome = $("#nome-completo").val();
	    cargo = $("#cargo").val();
	    email = $("#user-email").val();
	    senha = $("#senha1").val();
	    confsenha = $("#rpt-senha").val();


	    if ($("#enviar").val()=="Alterar") {

	    	$.ajax({
	        url: "http://localhost/MakerTech/server/webservice_usuario.php",
	        method: "get",
	        data:{
	            "tipo":"editar",
	            "iduser":iduser,
	            "nome":nome,
	            "cargo":cargo,
	            "email":email,
	            "senha":senha,
	            "confsenha":confsenha
	        },
	        success: function(retorno){

	        	//document.location.reload(true);

	            nome = $("#nome-completo").val("");
	            cargo = $("#cargo").val("");
	            email = $("#user-email").val("");
	            senha = $("#senha1").val("");
	            confsenha = $("#rpt-senha").val("");


	    		$("#enviar").val("Enviar");

				listar();
				M.toast({html: retorno})
	        	//alert(retorno);
	        },
	        timeout: 3000,
	        error: function(){
				M.toast({html: 'erro ao realizar requisição'})
	            //alert("erro ao realizar requisição");
	        }
	    });

	    }

	    else{

	    	$.ajax({
	            url: "http://localhost/MakerTech/server/webservice_usuario.php",
	            method: "get",
	            data:{
	                "tipo":"cadastrar",
		            "nome":nome,
		            "cargo":cargo,
		            "email":email,
		            "senha":senha,
		            "confsenha":confsenha
	            },
	            success: function(retorno){

	            	if (retorno == 1){

	            		nome = $("#nome-completo").val("");
			            cargo = $("#cargo").val("");
			            email = $("#user-email").val("");
			            senha = $("#senha1").val("");
			            confsenha = $("#rpt-senha").val("");
			            window.location="index.html";

	            	}
		            else{
						M.toast({html: retorno.split("{")[0]})
		            	//alert(retorno.split("{")[0]);
		            }
	            },
	            timeout: 3000,
	            error: function(){
					M.toast({html: 'erro ao realizar requisição'})
	                //alert("erro ao realizar requisição");
	            }
	    	});
	    }

	});



});