
$(function () {
    $("#txtReportedDate").datepicker();
    $("#txtStartDate").datepicker({
        onSelect: function (selected) {
            var dt = new Date(selected);
            dt.setDate(dt.getDate() + 1);
            $("#txtEndDate").datepicker("option", "minDate", dt);
            if ($("#txtEndDate").val().length>0)
                filterByDate(selected, $("#txtEndDate").val());
        }
    });
    $("#txtEndDate").datepicker({
        onSelect: function (selected) {
            var dt = new Date(selected);
            dt.setDate(dt.getDate() - 1);
            $("#txtStartDate").datepicker("option", "maxDate", dt);
            if ($("#txtStartDate").val().length > 0)
                filterByDate($("#txtStartDate").val(), selected);
        }
    });
    $("#dialog").dialog({
        closeOnEscape: true,
        modal: true,
        position: {
            my: "center bottom",
            at: "center top",
        },
        width: 600,
        height: 580,
        show: "blind",
        hide: "explode",
        autoOpen: false,
        open: function () {
            $('.ui-widget-overlay').click(function () {
                $("#dialog").dialog("close");
            });
        }  
    });
    $("#dialogConfirmDelete").dialog({
        closeOnEscape: true,
        modal: true,
        position: {
            my: "center bottom",
            at: "center top",
        },
        width: 280,
        height: 200,
        show: "blind",
        hide: "explode",
        autoOpen: false,
        open: function () {
            $('.ui-widget-overlay').click(function () {
                $("#dialogConfirmDelete").dialog("close");
            });
        }
    });
    $("#defectForm").validate({
        rules: {
            inpCustomer: "required",
            inpPriority: "required",
            txtReportedDate: "required",
            txtdescription: "required"
        },
        messages: {
            inpCustomer: "Please select customer",
            inpPriority: "please select priority",
            txtReportedDate: "Please select reference date",
            txtdescription: "Description required",
        }
    })
});

function fnSHowAllDefects() {
    tr = $('#tableDefects tr');

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        tr[i].style.display = "";
    }
}

function filterDefects(filterText, column) {
    var  tr, td, i;
    var tr = $('#tableDefects tr');

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[column];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filterText.toUpperCase()) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function filterByDate(startDate, endDate) {
    var _startDate = new Date(startDate);
    var _endDate = new Date(endDate);
    if (_startDate instanceof Date && _endDate instanceof Date && _startDate<=_endDate)
    {
        var tr, td, i;
        var tr = $('#tableDefects tr');

        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[2];
            if (td) {
                var currentDate = new Date(td.innerHTML);
                if (_startDate<=currentDate && currentDate<=_endDate) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    debugger;
}

function fnDeleteRowByID(defectID)
{
    var tr, i,currentDefectID;
    var tr = $('#tableDefects tr');

    for (i = 0; i < tr.length; i++) {
        currentDefectID = tr[i].getAttribute("data-defectID");
        if (currentDefectID == defectID)
        {
            tr[i].remove();
            break;
        }

    }
    $("#dialogConfirmDelete").dialog("close");
}

function fnDeleteDefect(defectID) {
    var data =
        {
            'defectID': defectID
        };
    var dataObj = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: "/Home/DeleteDefect/",
        data: dataObj,
        contentType: "application/json; charset=utf-8",
        Accept: "application/json",
        dataType: "json",
        success: function (response) {
            fnDeleteRowByID(defectID);
        },
        error: function (x, y, z) {

        }
    });
}

function fnHandleDeleteClick(event) {
    var defectID = event.target.getAttribute("data-defectID");
    $("#hiddenDiffectID").val(defectID);
    $("#dialogConfirmDelete").dialog("open");
}

function fnHandleEditClick(event) {
    var defectID = event.target.getAttribute("data-defectID");
    fnGetDefectDetails(defectID);
}

function fnGetRow(defect) {
   return "<tr data-defectid='" + defect.DefectId + "'>" +
            "<td scope='row'>" + defect.Customer + "</td>" +
            "<td>" + defect.Priority + "</td>" +
            "<td>" + defect.CreatedDate + "</td>" +
            "<td>" + defect.description + "</td>" +
            "<td>"+
                "<img src='/Content/images/edit.png' class='imgAction editDefect' data-defectid='" + defect.DefectId + "'>" +
                "<img src='/Content/images/delete.png' class='imgAction imgIconDelete deleteDefect' data-defectid='" + defect.DefectId + "'>" +
            "</td>"+
         "</tr>";
}

function fnApplyFilter() {
    if ($("#selFilterBy").val() == 1 && $("#txtCustName").val().length>0)
    {
        filterDefects($("#txtCustName").val(), 0);
    }
    else if ($("#selFilterBy").val() == 2 && parseInt($("#selPriority").val())> 0) {
        filterDefects($("#selPriority  option:selected").text(), 1);
    }
    else if ($("#selFilterBy").val() == 3 && $("#txtStartDate").val().length > 0 && $("#txtEndDate").val().length > 0) {
        filterByDate($("#txtStartDate").val(), $("#txtEndDate").val());
    }
}

function fnAttachEvents() {
    var htmlRows = $("#tbleBodyDefects");
    htmlRows.find(".deleteDefect").click(function (event) {
        fnHandleDeleteClick(event);
    });
    htmlRows.find(".editDefect").click(function (event) {
        fnHandleEditClick(event);
    });
}

function fnReCreateDefectsList(defectList) {
    var htmlRows = ""; 
    $.each(defectList, function (i) {
        htmlRows += fnGetRow(defectList[i])
    });
    $("#tbleBodyDefects").empty();
    $("#tbleBodyDefects").append(htmlRows);
    fnApplyFilter();
    fnAttachEvents();
    $("#dialog").dialog("close");
}

function fnAddEditDefect() {
    var dataObject = JSON.stringify({
        DefectId: $("#hiddenAddEditDiffectID").val(),
        CustomerID: $("#inpCustomer").val(),
        Priority: $("#inpPriority").val(),
        CreatedDate: new Date($("#txtReportedDate").val()),
        description: $("#txtdescription").val()
    });
    $.ajax({
        type: "POST",
        url: "/Home/AddUpdateDefect/",
        data: dataObject,
        contentType: "application/json; charset=utf-8",
        Accept: "application/json",
        dataType: "json",
        success: function (response) {
            fnReCreateDefectsList(response);
        },
        error: function (xhr, ajaxOptions, error) {
        }
    });
}

function fnSetDefectForEdit(defect) {
    $("#hiddenAddEditDiffectID").val(defect.DefectId);
    $("#inpCustomer").val(defect.CustomerID);
    $("#inpPriority").val(defect.Priority);
    $('#txtReportedDate').datepicker("setDate", new Date(defect.CreatedDate));
    $("#txtdescription").val(defect.description);
}

function fnGetDefectDetails(defectID) {
    var data =
    {
        'defectID': defectID
    };
    var dataObj = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: "/Home/GetDefect/",
        data: dataObj,
        contentType: "application/json; charset=utf-8",
        Accept: "application/json",
        dataType: "json",
        success: function (response) {
            fnSetDefectForEdit(response);
            $("#dialog").dialog("open");
        },
        error: function (x, y, z) {

        }
    });
}

$("#btnAddDefect").click(function () {
    $("#hiddenAddEditDiffectID").val(0);
    $("#dialog").dialog("open");
});

$("#selFilterBy").change(function () {
    fnSHowAllDefects();
    if ($("#selFilterBy").val() == 1) {
        $("#divCustomer").show();
        $("#divPriority").hide();
        $("#divDateRange").hide();
        $("#txtCustName").val('');
    }
    else if ($("#selFilterBy").val() == 2) {
        $("#divCustomer").hide();
        $("#divPriority").show();
        $("#divDateRange").hide();
        $("#selPriority").val(0);
    }
    else if ($("#selFilterBy").val() == 3) {
        $("#divCustomer").hide();
        $("#divPriority").hide();
        $("#divDateRange").show();
        $("#txtStartDate").val('');
        $("#txtEndDate").val('');
    }
});

$("#txtCustName").keyup(function () {
    var filter = this.value.toUpperCase();
    filterDefects(filter,0)
});

$("#selPriority").change(function () {
    var filter = '';
    if ($("#selPriority").val() > 0)
        filter=$("#selPriority  option:selected").text();
    filterDefects(filter, 1);
});

$(".deleteDefect").click(function (event) {
    fnHandleDeleteClick(event);
    
});

$(".editDefect").click(function (event) {
    fnHandleEditClick(event);
    
});

$("#btnCancelDelete").click(function () {
    $("#dialogConfirmDelete").dialog("close");
});

$("#btnYesDelete").click(function () {
    fnDeleteDefect($("#hiddenDiffectID").val());
    
});

$("#btnCloseDefectPopup").click(function () {
    $("#dialog").dialog("close");
});

$("#btnAddEditDefect").click(function () {
    if ($("#defectForm").valid()) {
        fnAddEditDefect();
    }
    return;
});