//------------------------------------- INPUT FORM ---------------------------------//

const checked = $(".cbox");

checked.click(function () {
    if (checked.prop("checked")) {
        $(".add").text("Hit Enter to Search");
    }

    if (!checked.prop("checked")) {
        $(".message").val("");
        $(".add").text("Find a Video");
    }
});
