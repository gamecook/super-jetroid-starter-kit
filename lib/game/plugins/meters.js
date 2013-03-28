/**
 *  @meters.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.plugins.meters'
)
    .requires(
    'impact.game',
    'impact.image',
    'bootstrap.plugins.sound-effects'
)

    .defines(function () {

        ig.Game.inject({
            meterWidth:193,
            meterHeight:29,
            meterPadding:5,
            meterIconSize:{ x:32, y:29 },
            padding: 10,
            draw:function () {
                this.parent();
                if (this.player && !this.gameOver && !this.paused) {
                    var percent = (this.player["health"] / this.player["health" + "Max"]);
                    if (percent < 0) percent = 0;

                    this.drawMeterBar("health", percent, this.padding, this.padding);
                }
            },
            drawMeterBar:function (name, percent, x, y) {
                if (percent > 1) percent = 1;

                if (percent < 1)
                    ig.entitiesTextureAtlas.drawFrame("meter-background.png", x, y);

                ig.entitiesTextureAtlas.drawFrame("meter-" + name + ".png", x, y, false, percent * this.meterWidth + this.meterIconSize.x, this.meterHeight);
            },

        })

    });