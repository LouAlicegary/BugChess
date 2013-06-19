function VIEW_LOGIN_showLoginPage() {
    $('#submit_button').button();
    
    // STOPS BOUNCE ON MOBILE DEVICES WHEN DRAGGING
    document.ontouchmove = function(event) {event.preventDefault();};
    
    document.getElementById('submit_button').addEventListener('click', goToLobby, false);
    
    function goToLobby(event) {
         window.location.href = "games_lobby.php?name=" + document.getElementById("name_input").value;
    }     
}
