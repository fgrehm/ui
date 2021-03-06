$(function() {
  $("input.default")
    .each(function() {
      $(this).data("default_value", $(this).val());
    })
    .focus(function() {
      if ( $(this).val() == $(this).data("default_value") ) {
        $(this).removeClass("default");
        $(this).val("");
      }
    })
    .blur(function() {
      if ( $(this).val() == "" ) {
        $(this).addClass("default");
        $(this).val($(this).data("default_value"));
      }
    });
});