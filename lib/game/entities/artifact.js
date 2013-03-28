/**
 *  @artifact.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.artifact'
)
    .requires(
    'bootstrap.entities.base-chachki',
    'bootstrap.plugins.utils'
)
    .defines(function () {
        EntityArtifact = EntityBaseChachki.extend({
            _wmIgnore:false,
            name:"Artifact",
            size:{ x:50, y:50 },
            theme: 0,
            pickupItemSFX: new ig.Sound('media/sounds/pickup-item.*'),
            init: function (x, y, settings) {
                if (typeof settings.theme != "undefined") {
                    this.theme = ig.utils.randomRange(0, 3);
                }
                this.parent(x, y, settings);
            },
            setupAnimation: function () {
                var id = "0" + this.spriteId.toString();
                var atlas = ig.entitiesTextureAtlas;
                this.addTextureAtlasAnim(atlas, 'idle', 1, ['artifacts-' + this.theme + "-" + id + '.png'], false);
                this.currentAnim = this.anims.idle;
            },
            onPickup:function (target) {
                this.parent(target);
                var text = "Picked Up A " + this.toString().capitalize() + ".";
                ig.game.displayCaption(text, 5);

                this.pickupItemSFX.play();
            }
        })
    })