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
        url: "api/v1/model_autos/" + row.id + '/',
        method: "DELETE",
        headers: {
            'X-CSRFToken': csrftoken
        },
        data: {
            'key': row.id
        },
        success: function () {
            initTable('api/v1/model_autos/');
        },
    })
    },
    'click .changer': function editar(e, value, row){
        $('#changeModal').modal('show')
        console.log(row.id)
        $('#changeId').val(row.id)
        $('#changeName').val(row.name)
        $('#select:selected').val(row.mark_auto)

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
            field: 'name',
            title: 'Название',
            sortable: true,
            align: 'center'
        },{
            field: 'mark_auto',
            title: 'Марка',
            sortable: true,
            align: "center"
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

    initTable('api/v1/model_autos/');

    $('#area_select').on('changed.bs.select', function () {
        var id = $(this).val();
        initTable('api/v1/model_autos/?area=' + id);
    });

})

$('#form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: "api/v1/model_autos/",
        method: "post",
        headers: {
            'X-CSRFToken': csrftoken
        },
        async: false,
        data: {
            'name': $('#createName').val(),
            'mark_auto': $('#createMark').val()
        },
        success: function () {
            $('#createModal').modal('hide');
            initTable('api/v1/model_autos/');
        },

    })

})

$('#form1').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: "api/v1/model_autos/" + $('#changeId').val() + '/',
        method: "PUT",
        headers: {
            'X-CSRFToken': csrftoken
        },
        async: false,
        data: {
            'id': parseInt($('#changeId').val()),
            'name': String($('#changeName').val()),
            'mark_auto': $('#select').val()
        },
        success: function () {
            $('#changeModal').modal('hide');
            initTable('api/v1/model_autos/');
        },
    })
})


$('#create').on('click', function () {
    $('#createModal').modal('show');
})
