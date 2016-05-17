$(document).ready(function() {
    $("#submit-desktop").click(function() {
        var input_1 = $("#email").val();
        if (input_1 == "Email Address") $("#email").attr('value', '');
        if ($("#form-desktop").validate().element("#email")) {

            $('#form-desktop').submit();

            $("#desktopform").fadeOut(500);
            $("#submit-desktop").fadeOut(500);
            $("#thanks").delay(500).fadeIn();
            //alert ('submitted to desktop');
        } else {
            alert('Please fill out all required fields. \n\n- Thank you\n');
        }
    });

    $("#submit-mobile").click(function() {
        var input_1 = $("#email").val();
        if (input_1 == "Email Address") $("#email1").attr('value', '');
        if ($("#form-mobile").validate().element("#email1")) {

            $('#form-mobile').submit();

            $("#submit-mobile").fadeOut(500);
            $("#form-mobile").fadeOut(500);
            $("#thanks-mobile").delay(500).fadeIn();
            //alert ('submitted to mobile');
        } else {
            alert('Please fill out all required fields. \n\n- Thank you\n');
        }
    });
});
