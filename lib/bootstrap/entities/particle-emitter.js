/**
 *  @particle-emitter.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This entity is useful for spawning particles on an entity. The class
 *  comes with a few standard particles such as fire, water and snow.
 */
ig.module(
    'bootstrap.entities.particle-emitter'
)
    .requires(
    'impact.entity'
)
    .defines(function () {

        EntityParticleEmitter = ig.Entity.extend({
            _wmIgnore:false,
            _wmDrawBox:true,
            _wmBoxColor:'rgba(128, 28, 230, 0.7)',
            _wmScalable:true,
            lifetime:.1,
            particles:3,
            colorOffset:0,
            size:{x:8, y:8},
            instances:[],
            pool:[],
            maxInstances:10,
            target:null,
            targets:[],
            spawnEntity:null,
            particleLifeTime:1,
            fadetime:1,
            init:function (x, y, settings) {
                if (settings.width)
                    this.size.x = settings.width;
                this.parent(x, y, settings);
                this.idleTimer = new ig.Timer();
                this.targets = ig.ksort(this.target);
            },
            update:function () {
                if (this.targets.length < 1 || !this.spawnEntity)
                    return;

                if (this.idleTimer.delta() > this.lifetime) {
                    var newParticle = this.createParticle();
                    if (newParticle)
                        this.idleTimer.reset();
                }
            },
            createParticle: function () {
                //console.log("create particle")
                var instance;
                var instanceName = this.targets.random();

                //console.log("spawn at", instanceName);
                //Find random target
                var newTarget = ig.game.getEntityByName(instanceName);

                if (!newTarget) {
                    this.instances.splice(this.instances.indexOf(instanceName), 1);
                    return;
                }

                var x = (Math.random() * newTarget.size.x - 2) + newTarget.pos.x;
                var y = newTarget.pos.y + (newTarget.size.y - 5);
                if (this.instances.length < this.maxInstances) {
                    instance = ig.game.spawnEntity(this.spawnEntity, x, y, {spawner:this, lifetime:this.particleLifeTime, fadetime:this.fadetime});
                    this.instances.push(instance);
                    this.pool.push(instance);
                }
                else {
                    instance = this.pool.pop();
                    if (instance)
                        instance.reset(x, y);
                }
                return instance;
            },
            clear: function() {
                for (var i = 0; i < this.instances.length; i++) {
                    this.instances[i].kill();
                }
                this.instances.length = 0;
            }
        });


        EntityBaseParticle = ig.Entity.extend({
            size:{x:2, y:2},
            lifetime:1,
            fadetime:1,
            bounciness:0,
            collides:ig.Entity.COLLIDES.NONE,
            colorOffset:0,
            totalColors:7,
            idleTimer:null,
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                var frameID = Math.round(Math.random() * this.totalColors) + (this.colorOffset * (this.totalColors + 1));
                this.addAnim('idle', 0.2, [frameID]);
                this.idleTimer = new ig.Timer();
            },
            update:function () {
                /*if(this.currentAnim.alpha < .1)
                 return;*/

                if (this.idleTimer.delta() > this.lifetime) {
                    this.kill();
                    return;
                }
                this.currentAnim.alpha = this.idleTimer.delta().map(
                    this.lifetime - this.fadetime, this.lifetime,
                    1, 0
                ) - .2;

                this.parent();
            },
            reset:function (x, y) {
                this.pos.x = x;
                this.pos.y = y;
                this.currentAnim.alpha = 1;
                this.idleTimer.reset();
            },
            kill:function () {
                this.currentAnim.alpha = 0;
                this.spawner.pool.push(this);
            },

            draw:function () {
                if (this.currentAnim.alpha < .1)
                    return;

                this.parent();

            },
            handleMovementTrace:function (res) {
                this.parent(res);

                if (res.collision.x || res.collision.y) {
                    this.kill();
                }
            }
        });

    });

