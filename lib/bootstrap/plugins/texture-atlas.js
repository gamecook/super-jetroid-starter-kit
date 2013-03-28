/**
 *  @texture-atlas.js
 *  @version: 1.00
 *  @author: dpweberza@gmail.com & Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 */

ig.module(
    'bootstrap.plugins.texture-atlas'
    )
.requires(
    'impact.animation',
    'impact.image',
    'impact.entity'
    )
.defines(function () {
    "use strict";

    // Add a nice convenience method to the Entity class so that we can add TextureAtlasAnimations
    ig.Entity.inject({
        addTextureAtlasAnim: function (textureAtlas, name, frameTime, sequence, stop, maintainFrameOffset) {

            if (!textureAtlas)
                throw ('No texture atlas to add the animation from!');
            if (!name)
                throw ('No name to call the animation!');

            var a = new ig.TextureAtlasAnimation(textureAtlas, frameTime, sequence, stop, maintainFrameOffset);
            this.anims[name] = a;
            if (!this.currentAnim) {
                this.currentAnim = a;
            }

            return a;
        }
    });

    /**
     * A TextureAtlas class holds an Image and the packed texture JSON array exported from TexturePacker / ShoeBox
     *
     * Author: dpweberza@gmail.com
     *
     * Version 0.1  - 2012/10/14
     *
     * Notes:
     */
    ig.TextureAtlas = ig.Image.extend({
        jsonData: null,
        frameCache: [],
        load: function (loadCallback) {

            //console.log("load", this.loaded);
            if (this.loaded) {
                if (loadCallback) {
                    loadCallback(this.path, true);
                }

                return;
            }
            else if (!this.loaded && ig.ready) {
                this.loadCallback = loadCallback || null;

                // Load JSON data
                //console.log("this.path", this.path);
                var url = ig.prefix + (this.path.substr(0, this.path.lastIndexOf('.')) || this.path) + '.txt';

                //console.log("url", url);
                var AJAX = null;
                if (window.XMLHttpRequest) {
                    AJAX = new XMLHttpRequest();
                } else {
                    AJAX = new ActiveXObject("Microsoft.XMLHTTP");
                }
                if (AJAX) {
                    AJAX.open('get', url, false);  // synchronous                            
                    AJAX.send(null);
                    try {

                        this.jsonData = JSON.parse(AJAX.responseText);
                        //console.log('TextureAtlas: loaded JSON data from: ' + url);
                    } catch (error)
                    {
                        //console.log("Error parsing json:", error);
                    }
                } else throw ('TextureAtlas Exception: AJAX not supported!');


                //console.log("data", this.jsonData)
                this.data = new Image();
                this.data.onload = this.onload.bind(this);
                this.data.onerror = this.onerror.bind(this);
                this.data.src = ig.prefix + this.path + ig.nocache;
            }
            else {
                ig.addResource(this);
            }

            ig.Image.cache[this.path] = this;
        },

        getFrameData: function (frame) {

            //Return from cache if possible
            if (typeof this.frameCache[frame] != "undefined")
                return this.frameCache[frame];

            // Search for the frame data and cache
            for (var i = 0; i < this.jsonData.frames.length; i++) {
                if (this.jsonData.frames[i].filename == frame) {
                    this.frameCache[frame] = this.jsonData.frames[i];
                    return this.frameCache[frame]
                }
            }
            
            throw ('TextureAtlas Exception: frame [' + frame + '] does not exist!');
        },

        getWidth: function () {
            return this.jsonData.meta.size.w;
        },

        getHeight: function () {
            return this.jsonData.meta.size.h;
        },
        drawFrame: function (frame, targetX, targetY, maintainFrameOffset, width, height) {
            var frameData = this.getFrameData(frame);

            var x = targetX;
            var y = targetY;
            var w = (width == null) ? frameData.frame.w : width;
            var h = (height == null) ? frameData.frame.h : height;

            if (frameData.trimmed && maintainFrameOffset) {
                // offset the image position according to source size, so that trimmed image still appears as it should
                x += frameData.spriteSourceSize.x;
                y += frameData.spriteSourceSize.y;
            }

            this.draw(x, y, frameData.frame.x, frameData.frame.y, w, h);
        }
    });

    /**
    * A TextureAtlasAnimation extends Impact's Animation class to allow looking up a frames data from the TexturePacker JSON array
    *
    * Author: dpweberza@gmail.com
    *
    * Version 0.4  - 2013/02/19
    *
    * Notes:
    */
    ig.TextureAtlasAnimation = ig.Animation.extend({
        textureAtlas: null,
        maintainFrameOffset: false,
        frameData: 0,

        init: function (textureAtlas, frameTime, sequence, stop, maintainFrameOffset) {
            this.textureAtlas = textureAtlas;
            this.timer = new ig.Timer();
            this.frameTime = frameTime;
            this.sequence = sequence;
            this.frameData = this.textureAtlas.getFrameData(this.sequence[0]);
            this.stop = !!stop;
            if (maintainFrameOffset)
                this.maintainFrameOffset = maintainFrameOffset;
        },

        rewind: function () {
            this.timer.reset();
            this.loopCount = 0;
            this.frameData = this.textureAtlas.getFrameData(this.sequence[0]);
            return this;
        },

        update: function () {
            var frameTotal = Math.floor(this.timer.delta() / this.frameTime);
            this.loopCount = Math.floor(frameTotal / this.sequence.length);
            if (this.stop && this.loopCount > 0) {
                this.frame = this.sequence.length - 1;
            }
            else {
                this.frame = frameTotal % this.sequence.length;
            }
            this.frameData = this.textureAtlas.getFrameData(this.sequence[this.frame]);
        },


        draw: function (targetX, targetY) {
            var bbsize = Math.max(this.textureAtlas.width, this.textureAtlas.height);

            var x = targetX;
            var y = targetY;

            if (this.frameData.trimmed && this.maintainFrameOffset) {
                // offset the image position according to source size, so that trimmed image still appears centered as it should
                x += this.frameData.spriteSourceSize.x;
                y += this.frameData.spriteSourceSize.y;
            }

            // On screen?
            if (x > ig.system.width || y > ig.system.height || x + bbsize < 0 || y + bbsize < 0) {
                return;
            }

            if (this.alpha != 1) {
                ig.system.context.globalAlpha = this.alpha;
            }

            var halfWidth = this.frameData.frame.w / 2;
            var halfHeight = this.frameData.frame.h / 2;

            ig.system.context.save();
            ig.system.context.translate(
                ig.system.getDrawPos(x + halfWidth),
                ig.system.getDrawPos(y + halfHeight)
                );
            ig.system.context.rotate(this.angle);

            var scaleX = this.flip.x ? -1 : 1;
            var scaleY = this.flip.y ? -1 : 1;
            if (this.flip.x || this.flip.y) {
                ig.system.context.scale(scaleX, scaleY);
            }

            this.textureAtlas.draw(-halfWidth, -halfHeight, this.frameData.frame.x, this.frameData.frame.y, this.frameData.frame.w, this.frameData.frame.h);
            ig.system.context.restore();

            if (this.alpha != 1) {
                ig.system.context.globalAlpha = 1;
            }
        }
    });


    /**
     * A TextureAtlasImage extends Impact's Image class to allow looking up an images data from the TexturePacker JSON array
     *
     * Author: dpweberza@gmail.com
     *
     * Version 0.1  - 2012/10/22
     *
     * Notes:
     */
    ig.TextureAtlasImage = ig.Image.extend({
        textureAtlas: null,
        frameName: null,
        maintainFrameOffset: false,
        init: function (textureAtlas, frameName, maintainFrameOffset) {
            this.frameName = frameName;
            this.textureAtlas = textureAtlas;
            var frameData = this.textureAtlas.getFrameData(frameName);
            
            this.width = frameData.frame.w;
            this.height = frameData.frame.h;
        },
        draw: function (targetX, targetY) {
            this.textureAtlas.drawFrame(this.frameName, targetX, targetY);
        }
    });

    /**
     * A TextureAtlasFont extends Impact's Font class to allow looking up a font's bitmap from the TexturePacker JSON array
     *
     * Author: @jessefreeman
     *
     * Version 0.1  - 2013/02/19
     *
     * Usage:
     * DemoTextureAtlasFont = ig.Game.extend({
     *       textureImage: new ig.Image('media/font.png'),
     *       init: function ()
     *       {
     *           this.textureAtlas = new ig.TextureAtlas(this.textureImage, new ig.PackedTextures().font); // Create the texture atlas
     *           this.textureFont = new ig.TextureAtlasFont(this.textureAtlas);
     *       },
     *       draw: function ()
     *       {
     *           this.parent();
     *           this.textureFont.draw("Hello World", 0, 0);
     *       }
     *    })
     *
     * Notes:
     * This is based off of textures generated by ShoeBox. Use the following templates:
     *      Format Loop: \t{\n\t\t"filename": "@id",\n\t\t"frame": {"x":@x,"y":@y,"w":@w,"h":@h,"sx":@sx,"sy":@sy,"advanceX":@advanceX,"advanceY":@advanceX,}},\n
     *      Format Outer: {"frames": [\n@loop]\n,"meta": {\n\t"app": "ShoeBox",\n\t"lineHeight":@advanceY,\n\t"kerning":@kerning,\n\t"spaceWidth:0,\n\t"size": {"w":@texW,"h":@texH}\n}\n}
     */
    ig.TextureAtlasFont = ig.Font.extend({
        textureAtlas: null,
        spaceWidth: 0,
        init: function (textureAtlas, kerning, spaceWidth)
        {
            this.textureAtlas = textureAtlas;
            this.height = this.textureAtlas.jsonData.meta.lineHeight;
            this.letterSpacing = (typeof kerning == "undefined") ? this.textureAtlas.packedTexture.meta.kerning : kerning;
            this.spaceWidth = (typeof spaceWidth == "undefined") ? this.textureAtlas.packedTexture.meta.spaceWidth : spaceWidth;
            if (typeof this.spaceWidth == "undefined")
                this.spaceWidth = 0;
        },
        _drawChar: function (c, targetX, targetY)
        {
            if (c == 0)
                return this.spaceWidth + this.letterSpacing;

            var frameData = this.textureAtlas.getFrameData(c + this.firstChar);
            this.textureAtlas.draw(targetX + frameData.frame.sx, targetY + frameData.frame.sy, frameData.frame.x, frameData.frame.y, frameData.frame.w, frameData.frame.h);
            return frameData.frame.w + this.letterSpacing;
        },
        _widthForLine: function (text) {
            var width = 0;
            var frameData;
            var charW = 0;

            for (var i = 0; i < text.length; i++) {

                if (text.charCodeAt(i) == 0)
                    charW = this.spaceWidth + this.letterSpacing;
                else {
                    charW = this.textureAtlas.getFrameData(text.charCodeAt(i)).frame.w  + this.letterSpacing;
                }
                width += charW;
            }
            return width;
        },
    });

});