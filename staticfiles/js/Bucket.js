// ИНИЦИАЛИЗАЦИЯ ОСНОВНОЙ ТАБЛИЦЫ
var $table = $('#table');

var selections = [];

var csrftoken = $.cookie('csrftoken');
function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function(row) {
        return row.id
    })
}

if (window.history.replaceState) {
window.history.replaceState(null, null, window.location.href);
}

window.EventHandlers= {
    'click .deleter': function editar(e, value, row) {
        $.ajax({
        url: "api/v1/bucket/" + row.id + '/',
        method: "DELETE",
        headers: {
            'X-CSRFToken': csrftoken
        },
        data: {
            'key': row.id
        },
        success: function () {
            initTable('api/v1/bucket/');
        },
    })
    },
    'click .changer': function editar(e, value, row){
        $('#changeModal').modal('show')
        $('#changeId').val(row.id)
        $('#changeColor').val(row.color.name)
        $('#changeModel').val(row.model_auto.name)
        $('#changeAmount').val(row.amount)

    },
    'load': function dizabler(e, value, row){
        if(row.key === '-'){
            $('.changer').prop('disabled', true)
        }
        else{
            $('.changer').prop('enabled', true)
        }
    }
}

function responseHandler(res) {
    $.each(res.rows, function(i, row) {
        row.state = $.inArray(row.id, selections) !== -1
    })
    return res
}

function initTable(JsonUrl) {
    $table.bootstrapTable('destroy').bootstrapTable({
        url: JsonUrl,
            columns: [{
            field: 'id',
            title: 'id',
            sortable: true,
            align: 'center',
        },{
            field: 'color.name',
            title: 'Название',
            sortable: false,
            align: 'center'
        },{
            field: 'model_auto.name',
            title: 'Модель машины',
            sortable: false,
            align: "center"
        },{
            field: 'model_auto.mark_auto',
            title: 'Марка машины',
            sortable: false,
            align: "center"
        },{
            field: 'amount',
            title: 'Количество',
            sortable: true,
            align: 'center'
        },{
            field: 'date',
            title: 'Дата оформления',
            sortable: true,
            align: 'center'
        },{
            field: 'change',
            title: 'Изменить',
            sortable: false,
            align: 'center',
            visible: true,
            formatter : function(value,row) {
                    return '<button class="btn btn-primary btn-block changer" >Изменить</button>' +
                        '<button class="btn btn-secondary btn-block deleter">Удалить</button>';
                    },
            events: window.EventHandlers
            }],
    })
}

$table.on('check.bs.table uncheck.bs.table ' +
'check-all.bs.table uncheck-all.bs.table',
    function() {
        selections = getIdSelections()
})

$(document).ready(function() {

    initTable('api/v1/bucket/');

    $('#area_select').on('changed.bs.select', function () {
        var id = $(this).val();
        initTable('api/v1/bucket/?area=' + id);
    });

})

$('#form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: "api/v1/bucket/",
        method: "post",
        headers: {
            'X-CSRFToken': csrftoken
        },
        async: false,
        data: {
            'color': $('#createColor').val(),
            'model_auto': $('#createModel').val(),
            'amount': $('#createAmount').val()
        },
        success: function () {
            $('#createModal').modal('hide');
            initTable('api/v1/bucket/');
        },

    })

})

$('#form1').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: "api/v1/bucket/" + $('#changeId').val() + '/',
        method: "PUT",
        headers: {
            'X-CSRFToken': csrftoken
        },
        async: false,
        data: {
            'color.name': $('#changeColor').val(),
            'model_auto.name': $('#changeModel').val(),
            'amount': $('#changeAmount').val()
        },
        success: function () {
            $('#changeModal').modal('hide');
            initTable('api/v1/bucket/');
        },
    })
})


$('#create').on('click', function () {
    $('#createModal').modal('show');
})

$('#minus').on('click', function () {
    count = parseInt($(this).parent().children('input').val())
    if(count > 1){
        count = count - 1
    }
    $(this).parent().children('input').val(count)
})

$('#plus').on('click', function () {
    count = parseInt($(this).parent().children('input').val())
    count = count + 1
    $(this).parent().children('input').val(count)
})

$('#minus1').on('click', function () {
    count = parseInt($(this).parent().children('input').val())
    if(count > 1){
        count = count - 1
    }
    $(this).parent().children('input').val(count)
})

$('#plus1').on('click', function () {
    count = parseInt($(this).parent().children('input').val())
    count = count + 1
    $(this).parent().children('input').val(count)
})