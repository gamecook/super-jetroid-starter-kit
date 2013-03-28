/**
 *  @crystal.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.crystal'
)
    .requires(
    'bootstrap.entities.base-chachki',
    'impact.sound'
)
    .defines(function () {
        EntityCrystal = EntityBaseChachki.extend({
            _wmIgnore:false,
            name:"Crystal",
            types:["Worthless", "Nice", "Special", "Rare", "Unique"],
            value:10,
            size: { x: 25, y: 45 },
            pickupItemSFX: new ig.Sound('media/sounds/pickup-item.*'),
            setupAnimation: function () {
                var id = "0" + this.spriteId.toString();
                var atlas = ig.entitiesTextureAtlas;
                this.addTextureAtlasAnim(atlas, 'idle', 1, ['crystal-' + id + '.png'], false);
                this.currentAnim = this.anims.idle;
            },
            onPickup:function (target) {
                this.parent(target);
                var text = "Picked Up A " + this.toString().capitalize() + ".";
                ig.game.displayCaption(text, 5);

                this.pickupItemSFX.play();
            }
        });
    })