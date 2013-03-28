/**
 *  @base-monster.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'bootstrap.entities.base-monster'
)
    .requires(
    'bootstrap.entities.base-actor'
)
    .defines(function () {

        EntityBaseMonster = EntityBaseActor.extend({
            _wmIgnore: true,
            maxVel:{x:100, y:100},
            friction:{x:150, y:0},
            speed: 14,
            type: ig.Entity.TYPE.B,
            checkAgainst:ig.Entity.TYPE.A,
            collides:ig.Entity.COLLIDES.PASSIVE,
            collisionDamage:1,
            lookAhead:0,
            stayOnPlatform: true,
            spriteId: 0,
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.spawner = settings.spawner;
                this.setupAnimation(settings.spriteId ? settings.spriteId : 0);
            },
            setupAnimation:function (offset) {
                this.spriteId = this.lastspriteId = offset;
                this.parent(offset);
            },
            update:function () {
                this.parent();
                this.onUpdateAI();
            },
            onUpdateAI:function () {
                // override with your own AI logic
            },
            check:function (other) {
                //Do a quick test to make sure the other object is visible
                other.receiveDamage(this.collisionDamage, this);
            },
            draw:function () {
                if (ig.editor) {
                    if (this.lastspriteId != this.spriteId)
                        this.setupAnimation(this.spriteId);
                }
                this.parent();
            }
        });

    });
