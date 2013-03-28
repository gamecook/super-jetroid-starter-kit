/**
 *  @door.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.door'
)
    .requires(
    'bootstrap.entities.base-door'
)
    .defines(function () {
        EntityDoor = EntityBaseDoor.extend({
            setupAnimation: function() {
                this.size = { x: 65, y: 100 },
                this.offset = { x: 0, y: 0 },
                this.openSFX = new ig.Sound('media/sounds/door.*');
                var atlas = ig.entitiesTextureAtlas;
                this.addTextureAtlasAnim(atlas, 'idle', 1, ['door-00.png'], false);
                this.addTextureAtlasAnim(atlas, 'press', .04, ['door-00.png', 'door-01.png', 'door-02.png', 'door-04.png'], true);
                this.addTextureAtlasAnim(atlas, 'release', .04, ['door-04.png', 'door-02.png', 'door-01.png', 'door-00.png'], true);
                this.currentAnim = this.anims.idle;
            },
            isInView: function(value) {
                this.inView = value;
            }
        });
    })