/**
 *  @main.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.main'
)
    .requires(
    'impact.game',
    'bootstrap.plugins.sound-effects',
    'bootstrap.platforms.win8',
    'game.packed-textures',
    'plugins.tween-lite',
    'impact.font',
    'game.screens.select-screen',
    'game.screens.start-screen'
    /*,
    'impact.debug.debug'*/
)
    .defines(function () {

        ig.System.inject({
            setGameNow: function (gameClass, startLevel) {
                ig.game = new (gameClass)(startLevel);
                ig.system.setDelegate(ig.game);
            },
        });
        
        ig.startNewGame = function (width, height) {

            if (ig.ua.mobile) {
                // Disable sound for all mobile devices
                ig.Sound.enabled = false;
            }

            ig.main('#canvas', StartScreen, 60, width, height, 1);

            if (window.resizeGame)
                window.resizeGame();

        };

        if (typeof(WinJS) == 'undefined') {
            ig.startNewGame(800, 480);
        }

    });