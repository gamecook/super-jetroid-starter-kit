/**
 *  @base-chachki.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'bootstrap.entities.base-chachki'
)
.requires(
    'bootstrap.entities.base-item'
)
    .defines(function () {
        EntityBaseChachki = EntityBaseItem.extend({
            _wmIgnore:true,
            types:null,
            spriteId:0,
            equipable:false,
            value:0,
            theme:0,
            types: ["Worthless", "Nice", "Special", "Rare", "Unique"],
            init:function (x, y, settings) {
                this.parent(x, y, settings);

                if (typeof settings.id == "undefined") {
                    this.spriteId = this.types.indexOf(this.types.random());
                }

                this.setupAnimation();
            },
            setupAnimation:function () {
                //TODO override with animation configuration
            },
            draw:function () {
                if (ig.editor) {
                    if (this.currentAnim.tile != this.spriteId + (this.theme * this.types.length))
                        this.setupAnimation();
                }

                this.parent();

            },
            toString:function () {
                return this.types[this.spriteId] + " " + this.name;
            }
        })
    })