/**
 * Filename: entities.js
 * Project: Ludum Dare 30 Entry
 * Copyright: (c) 2014 Ludum Dare Team Tampere
 * License: The MIT License (MIT) http://opensource.org/licenses/MIT
 *
 * Game entities that can be spawned in the game world
 */


/*
 * Adds a Datacenter node of a certain colour
 */
function Datacenter(q, r, type, owner) {

  if(getTile(q, r) != undefined) return; // do nothing

  // save into the global tiles collection
  if(!tiles[q]) {
    tiles[q] = {};
  }
  tiles[q][r] = this;
  
  // create the tile container
  var tile = new createjs.Container();
  
  var colour = teams[owner]; // colour can be fetched from teams 
  if(typeof colour === 'undefined') {
    colour = 'grey'; //grey
  }

  //console.log(type+"_"+colour)

  // retain the coordinate and the colour
  tile.colour = colour;
  tile.q = q;
  tile.r = r;

  // create a container for the composite sprites
  var tileSpriteContainer = new createjs.Container();
  
  // create base sprite 
  var tileSprite = new createjs.Bitmap(loader.getResult("tile_" + colour));
    
  // create random structure sprite
  var tileStructureSprite = new createjs.Bitmap(loader.getResult(type + '_' + colour));
  switch(type) {
    case 'server':
      tileStructureSprite.x = 7;
      tileStructureSprite.y = -125;
      break;
    case 'dome':
      tileStructureSprite.x = 8;
      tileStructureSprite.y = -16;
      break;
    case 'factory':
      tileStructureSprite.x = 10;
      tileStructureSprite.y = -80;
      break;  
  }
    
  // create transfer animation
  var tileTransferAnimation = new createjs.Sprite(
    new createjs.SpriteSheet(loader.getResult("transfer_data")),
      "blank"
  );

  tileTransferAnimation.y -= 30;

  // add the sprites into sprite container
  tileSpriteContainer.addChild(tileSprite);
  tileSpriteContainer.addChild(tileTransferAnimation);
  tileSpriteContainer.addChild(tileStructureSprite);
    
  // add tileSpriteContainer into tile itself
  tile.addChild(tileSpriteContainer);

  // position
  var position = coordToPoint({q: q, r: r});
  tile.x = position.x;
  tile.y = position.y;

  // load a separate hitArea
  tile.hitArea = new createjs.Bitmap(loader.getResult('tile_mask'));

  // display the hitArea
  //tile.addChild(tile.hitArea);

  // set up mouse events
  tile.on('rollover', function() {
    this.children[0].y = -14;
  });
  tile.on('rollout', function() {
    this.children[0].y = 0;
  });
  tile.on('click', function(e) {
    if ( e.nativeEvent.button === 0 ) { 
      console.log(this);
    }
  });

  // add to game world
  map.addChild(tile);

  // fix draw order 
  sortDraw = true;

  // return the itself
  return this;
}

/*
 * Creates a single Path Node that represents data flow
 */
function PathNode(q, r, owner, phase) {

  if(getTile(q, r) != undefined) return; // do nothing
  
  var colour = teams[owner]; // colour can be fetched from teams 
  if(typeof colour === 'undefined') {
    colour = 'grey'; 
  }

  pathNode = new createjs.Container();
  pathNode.addChild(new createjs.Bitmap(loader.getResult('tile_' + colour)));

  // save coordinates
  pathNode.q = q;
  pathNode.r = r;

  // position the block
  var pos = coordToPoint({q: q, r: r});
  pathNode.x = pos.x;
  pathNode.y = pos.y;
  
  //pathNode.alpha = .4; // transparency

  map.addChild(pathNode);
  sortDraw = true; // recalculate draw order

  return this;
}

