function showEntry(entity) {
    $('#lastName').val(entity.lastName);
    $('#firstName').val(entity.firstName);
    $('#birthday').val(entity.birthday);
    $('#idView').html((entity.id && entity.id !=="")?
        'ID: ' + entity.id : null);
}
function clearEntry() {
    $('#lastName').val("");
    $('#firstName').val("");
    $('#birthday').val("");
    $('#idView').html("");
}
function makeForm() {
    function formLine(label, id) {
        return '<tr>' +
            '<td>' + label + ':</td><td><input id="' + id
            + '" type="text"/></td>' +
            '</tr>';
    }
    $('#memberEntry').html(
        '<table><tbody> \
        ' + formLine("Last name", "lastName") + '\
    ' + formLine("First name", "firstName") + '\
    ' + formLine("Birthday", "birthday") + '\
    </tbody></table>'
    )
        .append(
            '<span>' +
            '<button id="clearButton"' +
            ' onclick="clearEntry()">Clear</button>' +
            '<button id="submitButton"' +
            ' onclick="submit()">Submit</button> \
        </span>'
        )
        .append(
            '<span id="idView"></span> \
            <div class="clearfloat"></div>'
        );
}

function showErr(msg) {
    $('#errMsg').html(msg);
}
function clearErr() {
    $('#errMsg').html("");
}

function clearList() {
    $('#memberList').html("");
}
function makeList(data) {
    clearList();
    function tableRow(lastName, firstName, birthday, id) {
        return '<tr id="tab-'+id+'"> \
                <td>'+lastName+'</td> \
                <td>'+firstName+'</td> \
                <td>'+birthday+'</td> \
                <td><button class="btn-edit" onclick="edit('+id+')">EDIT</button></td> \
                <td><button class="btn-del" onclick="del('+id+')">DEL</button></td> \
    </tr>';
    }
    var tab = $('<table class="listTable"></table>');
    tab.html('<tbody>');
    $.each(data, function(ind,val) {
        tab.append(tableRow(val.lastName, val.firstName, val.birthday, val.id));
    });
    tab.append('</tbody>');
    $('#memberList').append(tab);
}
function removeEntry(id) {
    $('#tab-' + id).remove();
}

function submit() {
    var id = $('#idView').html();
    if(id.length > 4) id = id.substring(4);
    var lastName = $('#lastName').val();
    var firstName = $('#firstName').val();
    var birthday = $('#birthday').val();
    var url = (id === "") ? "../webapi/member" : "../webapi/member/" + id;
    var meth = (id === "") ? "POST" : "PUT";
    $.ajax({
        method: meth,
        url: url,
        data: {lastName:lastName, firstName:firstName, birthday:birthday}}
    )
        .done(function(msg) {
            clearErr();
            loadList();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            showErr("AJAX: " + errorThrown);
        });
}
function loadList() {
    var url = "../webapi/member";
    $.ajax({
        method: "GET",
        url: url
    })
        .done(function(msg) {
            clearErr();
            makeList(msg);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            showErr("AJAX: " + errorThrown);



        });
}
function edit(id) {
    var url = "../webapi/member/" + id;
    $.ajax({
        method: "GET",
        url: url
    })
        .done(function(msg) {
            clearErr();
            showEntry(msg);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            showErr("AJAX: " + errorThrown);
        });
}
function del(id) {
    clearEntry();
    var url = "../webapi/member/" + id;
    $.ajax({
        method: "DELETE",
        url: url
    })
        .done(function(msg) {
            clearErr();
            removeEntry(id);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            showErr("AJAX: " + errorThrown);
        });
}

$(function() {
    makeForm();
    loadList();
})