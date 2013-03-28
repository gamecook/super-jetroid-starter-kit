/**
 *  @random-map.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *
 *  This class creates a "Random Map" button in the weltmeister editor.
 *  It requires two layers, a collision layer named "collation" and your
 *  map layer named "main". The generator will automatically create the collision
 *  tiles.
 *
 *  You can manually load this plugin by including it into the weltmeister config.js
 *  requires block.
 *
 *  You will also need to supply a copy of ROT.js http://ondras.github.com/rot.js/hp/
 *
 */
ig.module(
    'bootstrap.plugins.weltmeister.random-map-button'
)
    .requires(
    'weltmeister.modal-dialogs'
)
    .defines(function () {
        ModalDialogTest = wm.ModalDialog.extend({
            pathDropdown:null,
            pathInput:null,
            fileType:'',
            init:function (text, okText, type) {
                this.fileType = type || '';
                this.parent(text, (okText || 'Select'));
            },
            initDialog:function () {
                this.parent();

                this.buttonDiv.before("<dl><br/>");

                this.buttonDiv.before('<dt>Map Size:</dt><dd><input type="text" class="number" id="mapSizeX" value="50"> x <input type="text" class="number" id="mapSizeY" value="50"></dd>');

                // 
                this.buttonDiv.before('<dt>Room Width:</dt><dd><input type="text" class="number" id="roomWidthX" value="3"> x <input type="text" class="number" id="roomWidthY" value="9"></dd>');

                this.buttonDiv.before('<dt>Room Height:</dt><dd><input type="text" class="number" id="roomHeightX" value="3"> x <input type="text" class="number" id="roomHeightY" value="5"></dd>');


                this.buttonDiv.before('<dt>Map Type:</dt><dd><select id="mapType"><option value="DividedMaze">Divided Maze</option><option value="IceyMaze">Icey Maze</option><option value="EllerMaze">Eller Maze</option><!--<option value="Cellular">Cellular</option>--><option value="Digger">Digger</option><option value="Uniform">Uniform</option></select></dd>');


                this.buttonDiv.before('<dt>Corridor Length:</dt><dd><input type="text" class="number" id="corridorLengthX" value="3"> x <input type="text" class="number" id="corridorLengthY" value="10"></dd>');

                this.buttonDiv.before('<dt>Dug Percentage:</dt><dd><input type="text" class="number" id="dugPercentage" value=".2"></dd>');

                this.buttonDiv.before('<dt>Time Limit:</dt><dd><input type="text" class="number" id="timeLimit" value="1000"></dd>');

                this.buttonDiv.before('<dt>Random Seed:</dt><dd><input type="text" class="number" id="randomSeed" value="1234"></dd>');

                this.buttonDiv.before('<br/>');
                //
                this.buttonDiv.before('<dt>Wall Tiles:</dt><dd><input type="text" class="text" id="wallTiles" value="0"></dd>');
                this.buttonDiv.before('<dt>Floor Tiles:</dt><dd><input type="text" class="text" id="floorTiles" value="1"></dd>');

                //
                this.buttonDiv.before('<dt>Target Layer:</dt><dd><input type="text" class="text" id="mapLayerID" value="main"></dd>');

            },
            clickOk:function () {
                //console.log("Generate level");
                var mainLayerName = $("#mapLayerID").val();
                var collisionLayerName = "collision";//$("#collisionLayerID").val();
                var mainLayer = ig.editor.getLayerWithName(mainLayerName);
                var collisionLayer = ig.editor.getLayerWithName(collisionLayerName);


                // Create layers
                if (!mainLayer)
                    mainLayer = this.createLayer(mainLayerName);

                if (!collisionLayer)
                    collisionLayer = this.createLayer(collisionLayerName);

                //var randomizer = new RandomMap($('#mapSize').val(), $('#roomSizeMax').val(), mainLayer, collisionLayer);

                this.generateLevel(mainLayer, collisionLayer);

                ig.editor.setActiveLayer("entities");
                mainLayer.resetDiv();
                collisionLayer.resetDiv();

                this.close();
            },
            createLayer:function (name) {
                var tmpName = 'new_layer_' + ig.editor.layers.length;
                ig.editor.addLayer();
                var newLayer = ig.editor.getLayerWithName(tmpName);
                newLayer.setName(name);
                newLayer.resetDiv();
                return newLayer;
            },
            generateLevel:function (targetLayer, collisionLayer) {
                if (ROT.isSupported()) {

                    var targetLayerData = targetLayer.data;
                    var collisionLayerData = collisionLayer.data;

                    targetLayerData.length = collisionLayerData.length = 0;

                    //console.log("collisionLayer.data", collisionLayer.data);


                    ROT.RNG.setSeed($('#randomSeed').val());


                    var map = new ROT.Map[$('#mapType').val()]($('#mapSizeY').val(), $('#mapSizeX').val(),
                        {
                            roomWidth:[Number($("#roomWidthX").val()), Number($("#roomWidthY").val())],
                            roomHeight:[Number($("#roomHeightX").val()), Number($("#roomHeightY").val())],
                            corridorLength:[Number($("#corridorLengthX").val()), Number($("#corridorLengthY").val())],
                            dugPercentage:Number($("#dugPercentage").val()),
                            timeLimit:Number($("#timeLimit").val())
                        });

                    map.create(function (x, y, wall) {
                        if (!targetLayerData[x]) {
                            targetLayerData[x] = [];
                        }
                        targetLayerData[x].push(wall ? Number($('#wallTiles').val()) : Number($('#floorTiles').val()));

                        if (!collisionLayerData[x]) {
                            collisionLayerData[x] = [];
                        }
                        collisionLayerData[x].push(wall ? 1 : 0);
                    });

                    targetLayer.width = collisionLayer.width = map._height;
                    targetLayer.height = collisionLayer.height = map._width;

                }
            }
        });
    });


$.getScript("lib/bootstrap/plugins/weltmeister/rot.js", function (data, textStatus, jqxhr) {

    // Load in ROT library, once lodaed add Random button and logic to map editor.

    //Add buttons to map editor
    $('.headerFloat').prepend('<input type="button" id="randomize" value="Generate Random Map" class="button"/>');
    $('#randomize').bind('click', function () {
        if (!ig.editor.testDialog) {
            ig.editor.testDialog = new ModalDialogTest('Random Map Generator', 'Generate', 'scripts');
        }
        ig.editor.testDialog.open();
    });

});





