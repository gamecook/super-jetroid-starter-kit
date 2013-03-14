/**
 *  @alien-b.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.alien-b'
)
    .requires(
    'bootstrap.entities.base-monster'
)
    .defines(function () {
        EntityAlienB = EntityBaseMonster.extend({
            _wmIgnore:false,
            size: { x: 70, y: 26 },
            attackSize: {x: 70, y: 100},
            offset:{ x:5, y:134 },
            speed: 0,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.FIXED,
            attackRange: 80,
            zIndex: 5,
            kidMode: false,
            attackSFX: new ig.Sound("media/sounds/alien-b-attack.*"),
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.kidMode = ig.game.difficulty;
            },
            setupAnimation:function (offset) {


                var atlas = ig.entitiesTextureAtlas;

                this.addTextureAtlasAnim(atlas, 'idle', .7, ['alien-b-' + offset + '-00.png', 'alien-b-' + offset + '-01.png', 'alien-b-' + offset + '-02.png', 'alien-b-' + offset + '-03.png', 'alien-b-' + offset + '-04.png', 'alien-b-' + offset + '-05.png', 'alien-b-' + offset + '-06.png', 'alien-b-' + offset + '-07.png', 'alien-b-' + offset + '-08.png', 'alien-b-' + offset + '-09.png', 'alien-b-' + offset + '-10.png', 'alien-b-' + offset + '-09.png', 'alien-b-' + offset + '-08.png', 'alien-b-' + offset + '-07.png', 'alien-b-' + offset + '-06.png', 'alien-b-' + offset + '-05.png', 'alien-b-' + offset + '-04.png', 'alien-b-' + offset + '-03.png', 'alien-b-' + offset + '-02.png', 'alien-b-' + offset + '-01.png'], false);
                this.addTextureAtlasAnim(atlas, 'attack', .1, ['alien-b-' + offset + '-20.png', 'alien-b-' + offset + '-19.png', 'alien-b-' + offset + '-17.png', 'alien-b-' + offset + '-16.png', 'alien-b-' + offset + '-15.png', 'alien-b-' + offset + '-14.png', 'alien-b-' + offset + '-13.png'], false);

                this.currentAnim = this.anims.idle;

                //TODO need to go to randome frame
            },
            check:function (other) {
                if (this.currentAnim == this.anims.attack || other.invincible || this.kidMode)
                    return;
                
                this.parent(other);
                
                this.currentAnim = this.anims.attack;
                this.currentAnim.loopCount = 0;
                this.currentAnim.rewind();

                this.attackSFX.play();
            },
            update:function () {
                this.parent();
                
                if (this.currentAnim == this.anims.attack && this.currentAnim.loopCount > 0) {                    
                    this.currentAnim = this.anims.idle;
                }
                
                if (this.canAttack(ig.game.player))
                    this.check(ig.game.player);
                    
                //TODO need to add logic to see if the alien is in view and has been "discovered"
            },
            onUpdateAI: function() {

            },
            canAttack: function (other) {
                return !(
                        this.pos.x >= other.pos.x + other.size.x ||
                        this.pos.x + this.attackSize.x <= other.pos.x ||
                        this.pos.y - this.attackSize.y >= other.pos.y + other.size.y ||
                        this.pos.y  <= other.pos.y
                    );
            },
        })
    })