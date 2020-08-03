
function puxar(idcupons){
    
    $("#formcad").collapse('show');

    $("#enviar").html('Alterar');

    $.ajax({
        url: "http://localhost/MakerTech/server/webservice_cupom.php",
        method: "get",
        data:{
            "tipo": "puxar",
            "idcupons": idcupons
        },
        success: function(retorno){
            let json = $.parseJSON(retorno);

            $("#idcupons").val(json.idcupons);
            $("#idproduto").val(json.idproduto);
            $("#titulo").val(json.titulo);
            $("#codigo").val(json.codigo);
            $("#data_criacao").val(json.data_criacao);
            $("#data_expdicao").val(json.data_expdicao);

        },
        timeout: 3000,
        error: function(){
            alert("erro ao realizar requisição");
        }
});
}

function excluir(idcupons){

    if(confirm("Deseja realmente excluir")){
        $.ajax({
            url: "http://localhost/MakerTech/server/webservice_cupom.php",
            method: "get",
            data:{
                "tipo": "excluir",
                "idcupons": idcupons
            },
            success: function(retorno){
                listar();
            },
            timeout: 3000,
            error: function(){
                alert("erro");
            }
        });
    }
}

function listar(){

    $("#tb").html("");

    $.ajax({
        url: "http://localhost/MakerTech/server/webservice_cupom.php",
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
                        <td id="id">${json[x].idcupons}</td>
                        <td class="titulo">${json[x].titulo}</td>
                        <td class="codigo">${json[x].codigo}</td>
                        <td class="data_criacao">${json[x].data_criacao}</td>
                        <td class="data_expdicao">${json[x].data_expdicao}</td>
                        <td id="excluir" title="Excluir" onclick="excluir(${json[x].idcupons})"><i class="material-icons red-text left tooltipped" style="cursor: pointer;" data-position="top" data-tooltip="Excluir">close</i></td>
                        <td id="editar" title="Clique para Editar" onclick="puxar(${json[x].idcupons})"><i class="material-icons blue-text left tooltipped" style="cursor: pointer;" data-position="top" data-tooltip="Excluir">border_color</i></td>
                    </tr>`;

                $("#tb").append(content);

            }
        },
        timeout: 3000,
        error: function(){
            alert("erro ao encontrar servidor");
        }
    });
}

function listarCliente(){

    $("#tb").html("");

    $.ajax({
        url: "http://localhost/MakerTech/server/webservice_cupom.php",
        metbod: "get",
        data:{
            "tipo": "consulta"
        },
        success:function(retorno){
            
            let json = $.parseJSON(retorno);
            let x = 0;
            
            for(x = 0; x < json.length; x++){

                let content = `
                    <div class="col s12 blue-grey lighten-5 bradius flow-text">
			            <p> Título: ${json[x].titulo} Código: ${json[x].codigo} Validade: ${json[x].data_expdicao}</p>
			        </div>`;

                $("#cupom").append(content);

            }
        },
        timeout: 3000,
        error: function(){
            alert("erro ao encontrar servidor");
        }
    });
}

$(document).ready(function(){
	listarCliente();
	listar();

	// $("#cad").hide();
	// $("#con").hide();
	$("#formcad").collapse('hide');
	$("#formcon").collapse('hide');

	$("#txtcad").click(function(){
		$("#formcad").collapse('toggle');
	});

	$("#txtcon").click(function() {
		$("#formcon").collapse('toggle');
	});

	$("#enviar").click(function(){

		let idcupons, titulo, codigo, data_criacao, data_expdicao;

	    idcupons = $("#idcupons").val();
	    // idproduto = $("#idproduto").val();
	    titulo = $("#titulo").val();
	    codigo = $("#codigo").val();
	    data_criacao = $("#data_criacao").val();
	    data_expdicao = $("#data_expdicao").val();


	    if (idcupons != 0) {

	    	$.ajax({
	        url: "http://localhost/MakerTech/server/webservice_cupom.php",
	        method: "get",
	        data:{
	            "tipo":"editar",
	            "idcupons":idcupons,
	            "titulo":titulo,
	            "codigo":codigo,
	            "data_criacao":data_criacao,
	            "data_expdicao":data_expdicao
	        },
	        success: function(retorno){

                $("#idcupom").val(0);
	            $("#titulo").val("");
	            $("#codigo").val("");
	            $("#data_criacao").val("");
	            $("#data_expdicao").val("");

                $("#enviar").html("Cadastrar");

	        	listar();
	        	//alert(retorno);
	        },
	        timeout: 3000,
	        error: function(){
	            alert("erro ao realizar requisição");
	        }
	    });

	    }

	    else{

	    	$.ajax({
	            url: "http://localhost/MakerTech/server/webservice_cupom.php",
	            method: "get",
	            data:{
	                "tipo":"cadastrar",
		            // "idproduto":idproduto,
		            "titulo":titulo,
		            "codigo":codigo,
		            "data_criacao":data_criacao,
		            "data_expdicao":data_expdicao
	            },
	            success: function(retorno){

		            $("#titulo").val("");
		            $("#codigo").val("");
		            $("#data_criacao").val("");
		            $("#data_expdicao").val("");
		            //alert(retorno);
	            	listar();
	            },
	            timeout: 3000,
	            error: function(){
	                alert("erro ao realizar requisição");
	            }
	    	});
	    }

	});



});