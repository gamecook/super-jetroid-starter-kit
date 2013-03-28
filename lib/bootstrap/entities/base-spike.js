/**
 *  @base-spike.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'bootstrap.entities.base-spike'
)
    .requires(
    'impact.entity'
)
    .defines(function () {
        EntityBaseSpike = ig.Entity.extend({
            _wmScalable:true,
            spriteId: 0, // Use this if you have different sprites in your texture
            spikeTexture: null, // This is the image that is used for your spikes
            collisionDamage: 1, // Amount of damage to apply to entity that collides with it
            gravityFactor:0,
            checkAgainst:ig.Entity.TYPE.A,
            collides:ig.Entity.COLLIDES.NONE,
            zIndex: 1,
            maxVelocityForDamage: 300, // Max value of velocity before entity takes damage
            init:function (x, y, settings) {
                this.parent(x, y, settings);

                if (settings.id != undefined) {
                    this.spriteId = settings.id;
                }
            },
            draw:function () {
                if (!this.spikeTexture)
                    return;

                if (ig.editor) {
                    if (this.size.x > this.spikeTexture.width)
                        this.size.x = this.spikeTexture.width;
                    this.size.y = this.spikeTexture.height;
                }
                this.spikeTexture.drawTile(
                    this.pos.x - this.offset.x - ig.game._rscreen.x,
                    this.pos.y - this.offset.y - ig.game._rscreen.y,
                    0,
                    this.size.x,
                    this.size.y,
                    0,
                    this.spriteId
                );
            },
            check:function (other) {
                if (Math.abs(other.vel.y) > this.maxVelocityForDamage) {
                    other.receiveDamage(this.collisionDamage, this);
                }
            }
        })
    })