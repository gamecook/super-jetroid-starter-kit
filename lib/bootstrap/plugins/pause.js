/**
 *  @pause.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 */
ig.module(
    'bootstrap.plugins.pause'
)
    .requires(
    'impact.game',
    'impact.timer',
    'bootstrap.plugins.menu'
)
    .defines(function () {

        ig.Game.inject({
            paused:false,
            pauseDelayTimer:new ig.Timer(),
            pauseButtonDelay:.5,
            updateEntities:function () {
                for (var i = 0; i < this.entities.length; i++) {
                    var ent = this.entities[i];
                    if (!ent._killed && !this.paused) {
                        ent.update();
                    }
                    else if (ent.ignorePause) {
                        ent.update();
                    }
                }
            },
            togglePause:function (override) {
                // This makes sure you can't call pause too quickly
                if (this.pauseDelayTimer.delta() > this.pauseButtonDelay) {
                    //TODO need to check this and make sure it works
                    this.paused = override != null ? override : !this.paused;

                    //TODO need to keep track of the time the pause was activated and call onResumePause when resumed
                    if (!this.paused)
                        this.onResume();
                    else
                        this.onPause();

                    this.pauseDelayTimer.reset();
                }

            },
            onResume:function () {
                if (this.hideMenu)
                    this.hideMenu();
            },
            onPause:function () {
                if (this.showMenu)
                    this.onShowPauseMenu()
            },
            /**
             * Override this if you want to display a custom pause menu
             */
            onShowPauseMenu:function () {
                this.showMenu(new Menu("Pause"));
            }
        });

        ig.Entity.inject({
            ignorePause:false
        })

    })