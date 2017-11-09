var chatRemote = require('../remote/chatRemote');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
handler.send = function(msg, session, next) {
	var rid = session.get('rid');
	var username = session.uid.split('*')[0];
	var channelService = this.app.get('channelService');
	var param = {
		msg: msg.content,
		from: username,
		target: msg.target
	};
	var channel = channelService.getChannel(rid, false);

	console.log("chat.handler.send: msg is " +msg.content);
	console.log("chat.handler.send: from " +username +" to " +msg.target);

	//the target is all users
	if(msg.target == '*') {
		channel.pushMessage('onChat', param);
	}
	//the target is specific user
	else {
		var tuid = msg.target + '*' + rid;
		var tsid = channel.getMember(tuid)['sid'];
		channelService.pushMessageByUids('onChat', param, [{
			uid: tuid,
			sid: tsid
		}]);
	}
	next(null, {
		route: msg.route
	});
};

handler.changeRoom = function(msg, session, next) {
	console.log("chat.handler.changeRoom: new room is " +msg.rid);

	var self = this;
	// leave from old channel
	self.app.rpc.chat.chatRemote.kick(session, session.uid, self.app.get('serverId'), session.get('rid'), null);

	var rid = msg.rid;
	var uid = msg.username + '*' + rid;
	session.bind(uid);
	session.set('rid', rid);

	//put user into new channel
	self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
		next(null, {
			users:users
		});
	});
};

handler.changeName = function(msg, session, next) {
	var rid = session.get('rid');
	next(null, {
		route: msg.route
	});
};
