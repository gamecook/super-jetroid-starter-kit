/**
 *  @camera.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 */
ig.module(
    'bootstrap.plugins.camera'
)
    .requires(
    'impact.game',
    'impact.image'
)

    .defines(function () {

        ig.Game.inject({
            cameraFollow:null,
            lightOffset:{ x:0, y:0 },
            quakeTimer: new ig.Timer(),
            duration: 1,
            loadLevel:function (data) {
                this.parent(data);
                //TODO this is hardcoded
                this.mainMap = ig.game.getMapByName("main");
                var tileSize = this.mainMap.tilesize;
                this.screenBoundary = {
                    min:{ x:0, y:-tileSize * .5 },
                    max:{ x:(this.mainMap.width * tileSize) - ig.system.width, y:(this.mainMap.height * tileSize) - (tileSize) - ig.system.height }
                };

                if (this.mainMap.width * this.mainMap.tilesize < ig.system.width) {
                    this.screenBoundary.min.x = -(ig.system.width - (this.mainMap.width * this.mainMap.tilesize)) * .5;
                    this.screenBoundary.max.x = this.screenBoundary.min.x;
                }
                
                if (this.mainMap.height * this.mainMap.tilesize < ig.system.height) {
                    this.screenBoundary.min.y = -(ig.system.height - (this.mainMap.height * this.mainMap.tilesize)) * .5;
                    this.screenBoundary.max.y = this.screenBoundary.min.y;
                }

            },
            update:function () {

                // Update all entities and backgroundMaps
                this.parent();


                
                
                if (this.cameraFollow) {

                    this.screen.x = this.cameraFollow.pos.x - (ig.system.width * .5) + this.cameraFollow.size.x * .5;
                    this.screen.y = this.cameraFollow.pos.y - (ig.system.height * .5) - this.screenBoundary.min.y + this.cameraYOffset - 100;

                    if (this.screen.x < this.screenBoundary.min.x)
                        this.screen.x = this.screenBoundary.min.x;
                    else if (this.screen.x > this.screenBoundary.max.x)
                        this.screen.x = this.screenBoundary.max.x;
                    if (this.screen.y < 0)
                        this.screen.y = 0;

                }

                if (!this.paused) {
                    // Handle screen shake
                    var delta = this.quakeTimer.delta();
                    
                    if (delta < -0.1) {
                        this.quakeRunning = true;
                        var s = this.strength * Math.pow(-delta / this.duration, 2);
                        if (s > 0.5) {
                            ig.game.screen.x += Math.random().map(0, 1, -s, s);
                            ig.game.screen.y += Math.random().map(0, 1, -s, s);
                        }
                    } else {
                        this.quakeRunning = false;
                    }
                }
            },
            shake: function (duration, strength, ignoreShakeLock) {

                this.duration = duration ? duration : 1;
                this.strength = strength ? strength : 3;

                if (!ignoreShakeLock && this.quakeRunning) {
                    return;
                }
                //this.enterSFX.play();
                this.quakeTimer.set(this.duration);
            }

        })

    });