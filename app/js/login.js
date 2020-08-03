function removerValidacao() {
    $("input").removeClass("is-valid");
    $("input").removeClass("is-invalid");
    $("select").removeClass("is-valid");
    $("select").removeClass("is-invalid"); 
}

function limparFormulario() {   
    $("#txtnome").val("");
    $("#txtarea").val(0);
    $("#txtemail2").val("");
    $("#txtsenha2").val("");
}

$(document).ready(function() {
    //verficação do cookie
    $.post(url_cliente, {tipo: "checkCookie"}).done((dados) => {
        let json = $.parseJSON(dados);
        if (json.status) {
            window.location = "perfil_cliente.html";
        }
    });

    $('.modal').modal();
    $('#btnlogar').click(() => { 
        let email = $('#txtemail').val(); 
        let senha = $('#txtsenha').val();
        
        if(verificarEmail(email)) 
            $('#txtemail').addClass("is-valid");
        else
            $('#txtemail').addClass("is-invalid");

        if (verificarCampo(senha, 6)) 
            $('#txtsenha').addClass("is-valid");
        else
            $('#txtsenha').addClass("is-invalid");

        let qtderros = $("input.is-invalid").length;
        if(qtderros == 0){
            $.post(url_cliente,{tipo: "logar", txtemail: email, txtsenha: senha})
            .done((data) => {
                console.log(data);
                $.post(url_cliente, {tipo: "checkCookie"}).done((dados) => {
                    let json = $.parseJSON(dados);
                    if (json.status) {
                        window.location = "perfil_cliente.html";
                    } else {
                        M.toast({html: "erro ao logar"})
                        //alert("erro ao logar");
                    }
                });
            });
        } else {
            M.toast({html: "preencher os campos corretamente"})
            //alert("preencher os campos corretamente");
        }
    });

    $("#btnenviar").click(() => {
        removerValidacao();

        let nome, area, email, senha;

        nome = $("#txtnome").val();
        area = $("#txtarea").val();
        email = $("#txtemail2").val();
        senha = $("#txtsenha2").val();

        if(verificarCampo(nome, 3))
            $("#txtnome").addClass("is-valid");
        else
            $("#txtnome").addClass("is-invalid");

        if (!verificarArea(area))
            M.toast({html: "invalido"})
            //alert("invalido");
        else 
            area =  verificarArea(area);
            $("#txtarea").addClass("is-valid");

        if(verificarEmail(email, 3))
            $("#txtemail").addClass("is-valid");
        else
            $("#txtemail").addClass("is-invalid");
    
        if(verificarCampo(senha, 6))
            $("#txtsenha").addClass("is-valid");
        else
            $("#txtsenha").addClass("is-invalid");
    
        var qt_derros = $("input.is-invalid").length;

        if(qt_derros == 0) {
            $.post(url_cliente, {
                tipo: 'cadastrar',
                codigo: 0,
                txtnome: nome,
                txtarea: area,
                txtemail: email,
                txtsenha: senha
            }).done((retorno) => {
                var dados = JSON.parse(retorno);
                if (dados.sucesso) {
                    M.toast({html: dados.sucesso})
                    //alert(dados.sucesso);
                }
                else if (dados.erros) {
                    M.toast({html: dados.erros})
                    //alert(dados.erros);
                }
                limparFormulario();
            }).fail(() => {
                M.toast({html: "Erro ao comunicar o servidor, tente novamente!"})
                //alert("Erro ao comunicar o servidor, tente novamente!");
            });
        }
        else {
            // $("#msg-erro").html("Verificar os campos destacados");
            // $("#mensagem").slideDown("fast");
            M.toast({html: "Verificar os campos destacados"})
            //alert("Verificar os campos destacados");
        }
    });
    
});