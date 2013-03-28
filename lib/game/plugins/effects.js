/**
 *  @effects.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.plugins.effects'
)
    .requires(
    'impact.game',
    'impact.image',
    'bootstrap.plugins.camera'
)

    .defines(function () {

        ig.Game.inject({
            scanLines: new ig.Image("media/sprites/scan-lines.png"),
            lightMask: new ig.Image("media/sprites/lighting-effect.png"),
            update: function () {
                this.parent();

                if (this.cameraFollow) {

                    if (this.lightMask) {
                        this.lightOffset.x = (this.cameraFollow.pos.x - this.screen.x) - this.lightMask.width * .5;
                        this.lightOffset.y = (this.cameraFollow.pos.y - this.screen.y) - this.lightMask.height * .5;
                    }
                }
            },
            draw: function(){
                this.parent();

                if (this.cameraFollow) {
                    // Draw light mask
                    if (this.lightMask)
                        this.lightMask.draw(this.lightOffset.x, this.lightOffset.y);
                }

                if (this.scanLines)
                    this.scanLines.draw(0, 0);
            }
        })

    });