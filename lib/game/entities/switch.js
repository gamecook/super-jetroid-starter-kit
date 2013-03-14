/**
 *  @base-actor.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.switch'
)
    .requires(
    'bootstrap.entities.base-switch',
    'impact.sound'
)
    .defines(function () {
        EntitySwitch = EntityBaseSwitch.extend({
            setupAnimation: function () {
                this.parent();
                
                this.size = { x: 50, y: 15 };
                this.offset = { x: 0, y: -5 };
                
                var atlas = ig.entitiesTextureAtlas;

                this.addTextureAtlasAnim(atlas, 'idle', 1, ['switch-00.png'], false);
                this.addTextureAtlasAnim(atlas, 'press', .04, ['switch-01.png', 'switch-02.png'], true);
                this.addTextureAtlasAnim(atlas, 'release', .04, ['switch-02.png', 'switch-01.png', 'switch-01.png'], true); // Add texture atlas animation

                this.currentAnim = this.anims.idle;

            }
        });
    })