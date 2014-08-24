/**
 * server.js
 * keeps internal-state of application in sync with backend.
 * this heavily uses dpd.js from deployd.com
 */

function Server() {
  this.user = {};
  this.game = {};
  this.hexes = {};
  this.connections = {};
  this.startHex = {};
  this.teams = {};
  return this;
}

Server.prototype = {
  constructor: Server,
  init:function ()  {
    var _this = this;
    //create random user
    //var randomUser = Math.random().toString(36).slice(2);
    var randomUser = 'm2h36yjex4txzuxr';
    /*dpd.users.post({username: randomUser,password: randomUser, team: "125c70d7f342983f"}, function(user,err){
      if(err) return console.log(err);
    });*/
    //and login
    dpd.users.login({username: randomUser,password: randomUser}, function(user,err) {
      if(err) return console.log(err);
      _this.user = user;
    });
    //get tick and game latest gameinfo
    dpd.games.get({$sort: {startTime: -1}, $limit: 1}, function(game,err) {
      if(err) return console.log(err);
      _this.game = game[0];
    });
    //get random team-location for user
    dpd.hexes.get({owner: this.user.team, $limit: 1}, function(hex){
      _this.startHex = hex[0];
    });
    //get hexes
    dpd.hexes.get(function(hexes){
      _this.hexes = hexes;
    });
    //get connections
    dpd.connections.get(function(connections){
      _this.connections = connections;
    });
    //get teams
    dpd.teams.get(function(teams){
      _this.teams = teams;
    });
  },
  /**
   * Whole world can be quite big. This gets all hexes which are in users context
   * @param qMin, qMax, rMin, rMax  
   * => coordinates of window
   */
  getHexesInWindow:function (qMin, rMin, qMax, rMax) {
    var query = {$and: [{"q": {$gte:qMin}}, {"q": {$lte:qMax}},
                        {"r": {$gte:rMin}}, {"r": {$lte:qMax}}]};
    dpd.hexes.get(query, function (err) {
      if(err) return console.log(err);
      return result;
    });
  },
  createConnection:function () {
    //console.log("added connection");
  }
}