/**
 *  @menu.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2013 Jesse Freeman, under The MIT License (see LICENSE)
 */
ig.module(
    'bootstrap.plugins.menu'
)
    .requires(
    'impact.game',
    'impact.font'
)
    .defines(function () {

        ig.Game.inject({
            activeMenu:null,

            draw:function () {
                this.parent();
                if (this.activeMenu)
                    this.activeMenu.draw();
            },
            showMenu:function (view) {
                if (view.draw)
                    this.activeMenu = view;
            },
            hideMenu:function () {
                this.activeMenu = null;
                //TODO need to make sure we don't have to destroy any menu
            },
            loadLevel:function (data) {
                //TODO this really should be tied into game over but it's safer to remove any menus when a level loads
                this.hideMenu();
                this.parent(data);
            }
        });

        Menu = ig.Class.extend({
            menuFont: null,
            title:null,
            init:function (title) {
                this.title = title ? title : " Menu Title";
            },
            draw:function () {
                this.drawModal();
                var x = ig.system.width * .5;
                var y = ig.system.height * .5;
                if (this.menuFont)
                    this.menuFont.draw(this.title, x, y, ig.Font.ALIGN.CENTER);
            },
            drawModal:function (color) {
                //TODO need to make this cleaner
                if (!color) color = 'rgba(0,0,0,0.8)';
                ig.system.context.fillStyle = color;
                ig.system.context.fillRect(0, 0, ig.system.width * ig.system.scale, ig.system.height * ig.system.scale);
            }
        })


    })