/**
 *  @health-powerup.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.health-powerup'
)
    .requires(
    'bootstrap.entities.base-powerup'
)
    .defines(function () {
        EntityHealthPowerup = EntityBasePowerup.extend({
            _wmIgnore:false,
            powerUpProperty:"health",
            value:10,
            init: function (x, y, settings) {
                this.parent(x, y, settings);

                var atlas = ig.entitiesTextureAtlas;
                this.addTextureAtlasAnim(atlas, 'idle', 1, ['power-up-health.png'], false);
            },
        })
    })