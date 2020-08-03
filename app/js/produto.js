function listarProdutosCrud(nome){
    $.post(url, {"type": "listar_produto"}).done(function(retorno){
        let json = $.parseJSON(retorno); 
        let conteudo = "";
        for(let i=0; i<json.length; i++){
            conteudo +=`
            <tr>
                <td>${json[i].idproduto}</td>                
                <td><img src="${url_imagens+json[i].img}" width="50px"></td>                
                <td>${json[i].nome}</td>                
                <td>${json[i].cor}</td>                
                <td>${json[i].peso}</td>                
                <td>${json[i].descricao}</td>                
                <td>${json[i].link_compra}</td>                
                <td class="icones"><a href="javascript:consultarProduto(${json[i].idproduto})"><i class="fas fa-eye view"></i></a> <a href="javascript:excluirProduto(${json[i].idproduto}, '${json[i].img}')"><i class="far fa-trash-alt"></i></a></td>
            </tr>                              
            `;
        }
        $("#listagem_produtos_crud").html(conteudo);
    });
}

function listarProdutos(nome){
    $.post(url, {"type": "listar_produto"}).done(function(retorno){
        let json = $.parseJSON(retorno);
        let conteudo = "";
        for(let i=0; i<json.length; i++){
            conteudo +=`
            <div class="card">
                    <div class="card-image">
                      <img src="${url_imagens+json[i].img}">
                      <div class="card-panel">
                      <span class="red-text">${json[i].nome}</span>
                      </div>
                    </div>
                    <div class="card-content">
                    <h5>Descrição</h5>
                      <blockquote style='text-align: justify;'>${json[i].descricao}</blockquote>
                      <p class="teal-text">Informações</p> <br>
                      <p class="left">Cor: ${json[i].cor}</p>   
                      <p class="right">Peso: ${json[i].peso} g</p>
                      <br> <br>
                      <a href="${json[i].link_compra}" class="btn red control"><i class="material-icons right">shopping_cart</i>COMPRAR</a>
                    </div>
            </div>
            <div class="section"></div>                             
            `;
        }
        $("#listagem_produtos").html(conteudo);
    });
}

function consultarProduto(id){        
    $.post(url, {"type": "consultar_produto", "idproduto": id}).done(function(retorno){
        let json = $.parseJSON(retorno);
        if(json.status == 1){ 
            $("#nome").val(json.nome);
            $("#cor").val(json.cor);
            $("#peso").val(json.peso);
            $("#link").val(json.link_compra);
            $("#descricao").val(json.descricao);
            $("#foto_atual").attr("src", url_imagens+json.img);
            $("#foto_temp").show();
            $("#form").collapse('show');    
            $("button[type=reset]").html("Cancelar");
            $("button[type=submit]").html("Salvar");
            $("input[name=type]").val("alterar_produto");
            $("#tituloOpcao").html("Alterando Produto");
            $("input[name=idproduto]").val(id);
        }
        else{
            alert(json.error);
        }
    });

}


function excluirProduto(id, img){
    if(confirm("Deseja realmente excluir esse produto?")){
        $.post(url, {"type": "excluir_produto", "idproduto": id, "foto": img}).done(function(retorno){
            let json = $.parseJSON(retorno);
            if(json.status==1){                
                listarProdutos("");
                listarProdutosCrud("");
            }
            else{
                alert(json.error);
            }
        });
    }
}

$(document).ready(function(){
    listarProdutos("");
    listarProdutosCrud("");
    destruirCookie = () => {
        $.get("http://localhost/MakerTech/server/webservice_cliente.php", {tipo: "destruirCookie"}).done((retorno) => {
            let json = $.parseJSON(retorno);
            if(json.status) {
                window.location = "index.html";
            }
        });
    }

    $.post("http://localhost/MakerTech/server/webservice_cliente.php", {tipo: "consultar", codigo: getCookie("idcliente")}).done((retorno) => {
        let json = $.parseJSON(retorno);
        $("#clienteNome").html(json.nome);
        $("#clienteEmail").html(json.email);
    });

    //verficação do cookie
    $.post("http://localhost/MakerTech/server/webservice_cliente.php", {tipo: "checkCookie"}).done((dados) => {
        let json = $.parseJSON(dados);
        if (json.status) {
            let sair = `<li><a onclick="destruirCookie()">Sair<i class="material-icons right">input</i></a></li>`;
            $('#nav-mobile').append(sair);
            $('#slide-out').append(sair);
        }
    });

    $("button[type=reset]").click(function(){
        if($("input[name=type]").val() != "cadastrar_produto"){
            window.location =   "crud_produto.html";
        }        
    });


    $("form").submit(function(e) {
        e.preventDefault();
        // $('button[type=submit]').prop('disabled', true);
        // $("#loading").show();
        let formData = new FormData(this);

        nome = $("#nome").val();
        descricao = $("#descricao").val();
        cor = $("#cor").val();
        peso = $("#peso").val();
        link = $("#link").val();
        if (verificarTexto(nome, 3) && verificarPalavras(descricao) && verificarTexto(cor, 3) && verificarNum(peso, 0) && verificarTexto(link, 10)) {                
            $.ajax({
                url: url,
                method: 'post',
                data: formData,            
                processData: false,
                enctype: 'multipart/form-data',
                contentType: false,
                success: function(retorno){                
                    let json = $.parseJSON(retorno);
                    if(json.status == 1){
                        //alert("Cadastro realizado com sucesso");
                        window.location = "crud_produto.html";
                    }else{
                        alert(json.error);
                    }
                    // $('button[type=submit]').prop('disabled', false);
                    // $("#loading").hide();
                },
                timeout:3000,
                error:function(){
                    alert("Erro ao fazer requisição");
                }
            });
        }
        else{
            alert("Preencha todos os campos corretamente.");
        }
    });    
});