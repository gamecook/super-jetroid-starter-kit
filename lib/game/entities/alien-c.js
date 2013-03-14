/**
 *  @alien-c.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.alien-c'
)
    .requires(
    'bootstrap.entities.base-monster'
)
    .defines(function () {
        EntityAlienC = EntityBaseMonster.extend({
            _wmIgnore: false,
            size: { x: 55, y: 55 },
            offset: { x: 35, y: 70 },
            collides: ig.Entity.COLLIDES.FIXED,
            attackSize: { x: 150, y: 75 },
            frozen: true,
            stayOnPlatform: true,
            maxVel: { x: 100, y: 1000 },
            lookAhead : 20,
            setupAnimation: function (offset) {
                
                var atlas = ig.entitiesTextureAtlas;

                this.addTextureAtlasAnim(atlas, 'idle', 1, ['alien-c-' + offset + '-00.png'], false); // Add texture atlas animation
                this.addTextureAtlasAnim(atlas, 'walk', .07, ['alien-c-' + offset + '-01.png', 'alien-c-' + offset + '-02.png', 'alien-c-' + offset + '-03.png', 'alien-c-' + offset + '-04.png', 'alien-c-' + offset + '-05.png'], false);
            },
            check: function (other) {
                this.parent(other);
            },
            onUpdateAI:function () {
                this.frozen = this.canWakeUp(ig.game.player);
                
                if (!this.frozen) {

                    if (this.currentAnim != this.anims.walk)
                        this.currentAnim = this.anims.walk;

                    if (this.stayOnPlatform) {
                        // near an edge? return!
                        if (ig.game.collisionMap.getTile(
                            this.pos.x + (this.flip ? -this.lookAhead : this.size.x + this.lookAhead),
                            this.pos.y + this.size.y + 1
                        ) != 0
                            && this.standing) {
                            var xdir = this.flip ? -1 : 1;
                            this.vel.x = this.speed * xdir;
                        }
                    }
                    
                    this.flip = ig.game.player.pos.x < this.pos.x;

                } else {
                    if (this.currentAnim != this.anims.idle)
                        this.currentAnim = this.anims.idle;
                }
                
                
                if (this.currentAnim)
                    this.currentAnim.flip.x = this.flip;
            },
            update: function () {
                this.parent();
                //TODO need to add logic to see if the alien is in view and has been "discovered"
            },
            canWakeUp: function (other) {
                return (
                        this.pos.x - this.attackSize.x >= other.pos.x + other.size.x ||
                        this.pos.x + this.size.x + this.attackSize.x <= other.pos.x ||
                        this.pos.y >= other.pos.y + other.size.y ||
                        this.pos.y + this.size.y <= other.pos.y
                    );
            }
        })
    })