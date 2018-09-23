$(document).ready(function () {
    $("#signout").click(function (e) {
        e.preventDefault();
        $.post("signOut", function () {
            sessionStorage.setItem("userLogIn", "false");
            window.location.href = '/';
        });

    })
    if (sessionStorage.getItem("userLogIn") == "true") {
        $("#signin").hide();
    } else {
        $("#myItemsPage").hide();
        $("#signout").hide();
    }

})