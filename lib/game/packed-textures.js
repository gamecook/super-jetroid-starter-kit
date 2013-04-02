/**
 *  @packed-textures.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *  
 *  Part of the Super Jetroid Starter Kit: 
 */
ig.module(
    'game.packed-textures'
)
    .requires(
    'bootstrap.plugins.texture-atlas'
)
    .defines(function () {

        ig.PackedTextures = ig.Class.extend({
            textureAtlas: null,
            staticInstantiate: function( ignoredFoo ) {
                if( ig.PackedTextures.instance == null ) {
                    return null;
                }
                else {
                    return ig.PackedTextures.instance;
                }
            },
    
            init: function(  ) {
                //console.log("create texture class");
                ig.PackedTextures.instance = this;

                // Attach these to the ig object
                ig.entitiesTextureAtlas = new ig.TextureAtlas("media/textures/entities.png");
                ig.screensTextureAtlas = new ig.TextureAtlas("media/textures/screens.png");
                ig.nokia36WhiteShadowTextureAtlas = new ig.TextureAtlas("media/textures/nokia-36-white-shadow.png");
                ig.nokia24WhiteShadowTextureAtlas = new ig.TextureAtlas("media/textures/nokia-24-white-shadow.png");
            },
            
        });
        
        ig.textureData = new ig.PackedTextures();
    })