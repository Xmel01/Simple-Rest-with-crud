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
        url: "api/v1/colors/" + row.id + '/',
        method: "DELETE",
        headers: {
            'X-CSRFToken': csrftoken
        },
        data: {
            'type': 'testplan',
            'key': row.id
        },
        success: function () {
            initTable('api/v1/colors/');
        },
    })
    },
    'click .changer': function editar(e, value, row){
        $('#changeModal').modal('show')
        $('#changeId').val(row.id)
        console.log(row.id)
        $('#changeName').val(row.name)

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

    initTable('api/v1/colors');

    $('#area_select').on('changed.bs.select', function () {
        var id = $(this).val();
        initTable('/api/v1/colors/?area=' + id);
    });

})

$('#form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: "api/v1/colors/",
        method: "post",
        headers: {
            'X-CSRFToken': csrftoken
        },
        async: false,
        data: {
            'name': $('#createName').val(),
        },
        success: function () {
            $('#createModal').modal('hide');
            initTable('api/v1/colors');
        },

    })

})

$('#form1').on('submit', function (e) {
    console.log($('#changeId').val())
    e.preventDefault();
    $.ajax({
        url: "api/v1/colors/" + $('#changeId').val() + '/',
        method: "PATCH",
        headers: {
            'X-CSRFToken': csrftoken
        },
        async: false,
        data: {
            //'id': $('#changeId').val(),
            'name': $('#changeName').val(),
        },
        success: function () {
            $('#changeModal').modal('hide');
            initTable('api/v1/colors');
        },
        error: function(){
            console.log('hui')
        }
    })
})


$('#create').on('click', function () {
    $('#createModal').modal('show');
})