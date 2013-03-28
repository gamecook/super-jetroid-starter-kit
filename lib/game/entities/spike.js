/**
 *  @spike.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.entities.spike'
)
    .requires(
    'bootstrap.entities.base-spike'
)
    .defines(function () {
        EntitySpike = EntityBaseSpike.extend({
            spikeTexture: new ig.Image("media/sprites/spike-sprites.png"),
            size: { x: 100, y: 20 }
        });
    })