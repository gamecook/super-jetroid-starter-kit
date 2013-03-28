window.addEventListener('resize', resizeGame, false);

function resizeGame() {

    var gameCanvas = document.getElementById('canvas');
            
    var widthToHeight = gameCanvas.width / gameCanvas.height;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameCanvas.style.height = newHeight + 'px';
        gameCanvas.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameCanvas.style.width = newWidth + 'px';
        gameCanvas.style.height = newHeight + 'px';
    }

    gameCanvas.style.marginTop = (-newHeight / 2) + 'px';
    gameCanvas.style.marginLeft = (-newWidth / 2) + 'px';

    
}
