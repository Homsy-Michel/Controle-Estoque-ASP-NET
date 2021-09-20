function abrir_form(dados) {
    $("#id_cadastro").val(dados.Id);
    $('#txt_nome').val(dados.Nome);
    $('#cbx_ativo').prop('checked', dados.Ativo);

    var modal_cadastro = $('#modal_cadastro');

    $("#msg_mensagem_aviso").empty();
    $("#msg_mensagem_aviso").hide();
    $("#msg_aviso").hide();
    $("#msg_erro").hide();

    bootbox.dialog({
        title: 'Cadastro de Grupo de Produtos',
        message: modal_cadastro
    })
        .on('shown.bs.modal', function () {
            modal_cadastro.show(0, function () {
                $('#txt_nome').focus();
            });
        })
        .on('hidden.bs.modal', function () {
            modal_cadastro.hide().appendTo('body');
        });
}

function criar_linha_grid(dados) {
    var ret =
        '<tr data-id=' + dados.Id + '>' +
        '<td>' + dados.Nome + '</td>' +
        '<td>' + (dados.Ativo ? 'SIM' : 'NAO') + '</td>' +
        '<td>' +
        '<a class="btn btn-primary btn-alterar" role="button" style="margin-right: 3px"><i class="glyphicon glyphicon-pencil"></i> Alterar</a>' +
        '<a class="btn btn-danger btn-excluir" role="button"><i class="glyphicon glyphicon-trash"></i> Excluir</a>' +
        '</td>' +
        '</tr>';

    return ret;
}

$(document).on('click', '#btn-incluir', function () {
    abrir_form({ Id: 0, Nome: '', Ativo: true });
})
    .on('click', '.btn-alterar', function () {
        var btn = $(this),
            id = btn.closest('tr').attr('data-id'),
            //Pode-se usar dessa forma também $(this).data("request-url")
            //usando como parametro data-request-url="@Url.Action("RecuperarGrupoProduto", "Cadastro")" no input alterar
            url = '/Cadastro/RecuperarGrupoProduto',
            param = { 'id': id };

        $.post(url, param, function (response) {
            if (response) {
                abrir_form(response);
            }
        });
    })
    .on('click', '.btn-excluir', function () {
        var btn = $(this),
            tr = btn.closest('tr'),
            id = tr.attr('data-id'),
            //Pode-se usar dessa forma também $(this).data("request-url")
            //usando como parametro data-request-url="@Url.Action("RecuperarGrupoProduto", "Cadastro")" no input alterar
            url = '/Cadastro/ExcluirGrupoProduto',
            param = { 'id': id };

        bootbox.confirm({
            message: "Realmente Deseja Excluir o Grupo de Produto",
            buttons: {
                confirm: {
                    label: 'Sim',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Não',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $.post(url, param, function (response) {
                        if (response) {
                            tr.remove();
                        }
                    });
                }
            }
        });
    })

    .on('click', ('#btn_confirmar'), function () {
        var btn = $(this),
            //Pode-se usar dessa forma também $(this).data("request-url")
            //usando como parametro data-request-url="@Url.Action("RecuperarGrupoProduto", "Cadastro")" no input alterar
            url = '/Cadastro/SalvarGrupoProduto',
            param = {
                Id: $('#id_cadastro').val(),
                Nome: $('#txt_nome').val(),
                Ativo: $('#cbx_ativo').prop('checked')
            };

        $.post(url, param, function (response) {
            if (response.Resultado == "OK") {
                if (param.Id == 0) {
                    param.Id = response.IdSalvo;
                    var table = $('#grid_cadastro').find('tbody'),
                        linha = criar_linha_grid(param);

                    table.append(linha);
                }
                else {
                    var linha = $('#grid_cadastro').find('tr[data-id=' + param.Id + ']').find('td');
                    linha
                        .eq(0).html(param.Nome).end()
                        .eq(1).html(param.Ativo ? 'SIM' : 'NÂO');
                }

                $('#modal_cadastro').parents('.bootbox').modal('hide');
            }
            else if (response.Resultado == "ERRO") {
                $("#msg_mensagem_aviso").hide();
                $("#msg_aviso").hide();
                $("#msg_erro").show();
            }
            else if (response.Resultado == "AVISO") {
                $("#msg_mensagem_aviso").html(formatar_mensagem_aviso(response.Mensagems));
                $("#msg_aviso").show();
                $("#msg_mensagem_aviso").show();
                $("#msg_erro").hide();
            }
        });
    }); 

function formatar_mensagem_aviso(mensagens) {
    var ret = '';
        for(var i = 0; i < mensagens.length; i++) {
            ret += '<li>' + mensagens[i] + '</li>';
    }

    return '<ul>' + ret + '</ul>';
}