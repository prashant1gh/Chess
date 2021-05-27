$("#SetFen").click(function() {
    var fenStr = $("#fenIn").val();
    parseFen(START_FEN);
    printBoard();
    searchPosition();
});