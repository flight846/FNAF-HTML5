$(document).ready(function() {
    console.log("Sound is playing?");
    $("#menu-start").get(0).play();
    $("#menu-start").on('click', function() {
        $("#call").get(0).play();
    });
//    
    
    
    
    
});