function listarPostCrud(nome) {
    $.post(url_post, {
        "type": "listar_post"
    }).done(function (retorno) {
        let json = $.parseJSON(retorno);
        let conteudo = "";
        for (let i = 0; i < json.length; i++) {
            conteudo += `
            <tr>
                <td>${json[i].idpost}</td>                
                <td><img src="${url_imagens+json[i].img}" width="50px"></td>                
                <td>${json[i].nome}</td>                
                <td>${json[i].descricao}</td>                
                <td>${json[i].visualizacao}</td>                
                <td>${json[i].criador}</td>                    
                <td class="icones"><a href="javascript:consultarPost(${json[i].idpost})"><i class="fas fa-eye view"></i></a> <a href="javascript:excluirPost(${json[i].idpost}, '${json[i].img}')"><i class="far fa-trash-alt"></i></a></td>
            </tr>                              
            `;
        }
        $("#listagem_post_crud").html(conteudo);
    });
}

function listarPostCliente(nome) {
    $.post(url_post, {
        "type": "listar_post_cliente"
    }).done(function (retorno) {
        let json = $.parseJSON(retorno);
        let conteudo = "";
        for (let i = 0; i < json.length; i++) {
            conteudo += `
            <div class="card">
                    <div class="card-image">
                      <img src="${url_imagens+json[i].img}" class="z-depth-1">
                      <div class="card-panel">
                        <span class="red-text text-darken-2">${json[i].nome}</span>
                    </div>
                    </div>
                    <div class="card-content">
                    <h4>Descrição</h4>
                      <blockquote>${json[i].descricao}</blockquote>
                    </div>
            </div>                             
            `;
        }
        $("#listagem_post").html(conteudo);
    });
}

function consultarPost(id) {
    $.post(url_post, {
        "type": "consultar_post",
        "idpost": id
    }).done(function (retorno) {
        let json = $.parseJSON(retorno);
        if (json.status == 1) {
            $("#nome").val(json.nome);

            if (json.visualizacao == 1)
                document.getElementById("sim").checked = true;
            else
                document.getElementById("nao").checked = true;

            $("#descricao").val(json.descricao);
            $("#foto_atual").attr("src", url_imagens + json.img);
            $("#foto_temp").show();
            $("#form").collapse('show');
            $("button[type=reset]").html("Cancelar");
            $("button[type=submit]").html("Salvar");
            $("input[name=type]").val("alterar_post");
            $("#tituloOpcao").html("Alterando post");
            $("input[name=idpost]").val(id);
        } else {
            alert(json.error);
        }
    });

}


function excluirPost(id, img) {
    if (confirm("Deseja realmente excluir esse post?")) {
        $.post(url_post, {
            "type": "excluir_post",
            "idpost": id,
            "foto": img
        }).done(function (retorno) {
            let json = $.parseJSON(retorno);
            if (json.status == 1) {
                listarPostCliente("");
                listarPostCrud("");
            } else {
                alert(json.error);
            }
        });
    }
}

$(document).ready(function () {
    listarPostCliente("");
    listarPostCrud("");

    destruirCookie = () => {
        $.get("http://localhost/MakerTech/server/webservice_cliente.php", {
            tipo: "destruirCookie"
        }).done((retorno) => {
            let json = $.parseJSON(retorno);
            if (json.status) {
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
    $.post("http://localhost/MakerTech/server/webservice_cliente.php", {
        tipo: "checkCookie"
    }).done((dados) => {
        let json = $.parseJSON(dados);
        if (json.status) {
            let sair = `<li><a onclick="destruirCookie()">Sair<i class="material-icons right">input</i></a></li>`;
            $('#nav-mobile').append(sair);
            $('#slide-out').append(sair);
        }
    });

    $("button[type=reset]").click(function () {
        if ($("input[name=type]").val() != "cadastrar_post") {
            window.location = "crud_post.html";
        }
    });


    $("form").submit(function (e) {
        e.preventDefault();
        // $('button[type=submit]').prop('disabled', true);
        // $("#loading").show();
        let formData = new FormData(this);

        nome = $("#nome").val();
        descricao = $("#descricao").val();
        if (verificarTexto(nome, 3) && verificarPalavras(descricao)) {
            $.ajax({
                url: url_post,
                method: 'post',
                data: formData,
                processData: false,
                enctype: 'multipart/form-data',
                contentType: false,
                success: function (retorno) {
                    let json = $.parseJSON(retorno);
                    if (json.status == 1) {
                        //alert("Cadastro realizado com sucesso");
                        window.location = "crud_post.html";
                    } else {
                        alert(json.error);
                    }
                    // $('button[type=submit]').prop('disabled', false);
                    // $("#loading").hide();
                },
                timeout: 3000,
                error: function () {
                    alert("Erro ao fazer requisição");
                }
            });
        } else {
            alert("Preencha todos os campos corretamente.");
        }
    });
});