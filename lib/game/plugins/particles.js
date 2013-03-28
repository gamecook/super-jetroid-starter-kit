/**
 *  @particles.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This entity is useful for spawning particles on an entity. The class
 *  comes with a few standard particles such as fire, water and snow.
 */
ig.module(
    'game.plugins.particles'
)
    .requires(
    'impact.entity',
    'bootstrap.entities.particle-emitter'
)
    .defines(function () {

        EntityBaseParticle.inject({
            size:{ x:10, y:10 },
            lifetime:3,
            fadetime:3,
            animSheet:new ig.AnimationSheet('media/sprites/particle-sprites.png', 10, 10),

        });

        EntityFlameParticle = EntityBaseParticle.extend({

            maxVel:{x:20, y:-20},
            vel:{x:10, y:30},
            friction:{x:10, y:0},
            colorOffset:2,
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.vel.x = (Math.random() * 1) * this.vel.x;
                this.vel.y = (Math.random() * 5 - 1) * this.vel.y;
            }

        });

        EntityWaterParticle = EntityFlameParticle.extend({
            maxVel:{x:50, y:150},
            vel:{x:40, y:0},
            friction:{x:10, y:100},
            colorOffset:5,
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.vel.x = (Math.random() * 5) * this.vel.x;
                //TODO need to fix the reset so these particles shoot out
            }
        });

        EntitySnowParticle = EntityFlameParticle.extend({
            maxVel:{x:160, y:200},
            vel:{x:100, y:30},
            friction:{x:100, y:100},
            lifetime:3,
            fadetime:3,
            colorOffset:4,
            totalColors:7,
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
                this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            }
        });
    });

