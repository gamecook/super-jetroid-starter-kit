/**
 *  @alien-a.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.alien-a'
)
    .requires(
    'bootstrap.entities.base-monster'
)
    .defines(function () {
        EntityAlienA = EntityBaseMonster.extend({
            _wmIgnore: false,
            size: { x: 40, y: 50 },
            offset: { x: 20, y: 30 },
            lookAhead: 10,
            maxVel: { x: 500, y: 500 },
            friction: { x: 750, y: 0 },
            speed: 70,
            setupAnimation: function (offset) {

                var atlas = ig.entitiesTextureAtlas;

                this.addTextureAtlasAnim(atlas, 'walk', .07, ['alien-a-' + offset + '-00.png', 'alien-a-' + offset + '-01.png', 'alien-a-' + offset + '-02.png', 'alien-a-' + offset + '-03.png', 'alien-a-' + offset + '-04.png', 'alien-a-' + offset + '-05.png'], false); // Add texture atlas animation

                this.currentAnim = this.anims.walk;
            },
            check: function (other) {
                this.parent(other);

                // Player is on top of monster so just keep walking in same direction
                if (other.pos.y > this.pos.y)
                    return;

                // Test what side the player is on and flip direction based on that.
                this.flip = (other.pos.x > this.pos.x) ? true : false;
                
            },
            onUpdateAI: function () {
                if (this.stayOnPlatform) {
                    // near an edge? return!
                    if (ig.game.collisionMap.getTile(
                        this.pos.x + (this.flip ? -this.lookAhead : this.size.x + this.lookAhead),
                        this.pos.y + this.size.y + 1
                    ) == 0
                        && this.standing) {
                        this.flip = !this.flip;
                    }
                }

                var xdir = this.flip ? -1 : 1;
                this.vel.x = this.speed * xdir;

                if (this.currentAnim)
                    this.currentAnim.flip.x = this.flip;
            },
            handleMovementTrace: function (res) {
                this.parent(res);
                // collision with a wall? return!
                if (res.collision.x) {
                    this.flip = !this.flip;
                }
            }
        })
    })