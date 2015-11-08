"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InternalClient = require("./InternalClient.js");
var EventEmitter = require("events");

var Client = (function (_EventEmitter) {
	_inherits(Client, _EventEmitter);

	/*
 	this class is an interface for the internal
 	client.
 */

	function Client(options) {
		_classCallCheck(this, Client);

		_EventEmitter.call(this);
		this.options = options || {};
		this.internal = new InternalClient(this);
	}

	// def login

	Client.prototype.login = function login(email, password) {
		var cb = arguments.length <= 2 || arguments[2] === undefined ? function (err, token) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.login(email, password).then(function (token) {
				cb(null, token);
				resolve(token);
			})["catch"](function (e) {
				cb(e);
				reject(e);
			});
		});
	};

	// def logout

	Client.prototype.logout = function logout() {
		var cb = arguments.length <= 0 || arguments[0] === undefined ? function (err) {} : arguments[0];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.logout().then(function () {
				cb();
				resolve();
			})["catch"](function (e) {
				cb(e);
				reject(e);
			});
		});
	};

	// def sendMessage

	Client.prototype.sendMessage = function sendMessage(where, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (e, m) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {

			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			self.internal.sendMessage(where, content, options).then(function (m) {
				callback(null, m);
				resolve(m);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def sendTTSMessage

	Client.prototype.sendTTSMessage = function sendTTSMessage(where, content) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (e, m) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {
			self.sendMessage(where, content, { tts: true }).then(function (m) {
				callback(null, m);
				resolve(m);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def reply

	Client.prototype.reply = function reply(where, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (e, m) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {

			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			var msg = self.internal.resolver.resolveMessage(where);
			if (msg) {
				content = msg.author + ", " + content;
				self.internal.sendMessage(msg, content, options).then(function (m) {
					callback(null, m);
					resolve(m);
				})["catch"](function (e) {
					callback(e);
					reject(e);
				});
			} else {
				var err = new Error("Destination not resolvable to a message!");
				callback(err);
				reject(err);
			}
		});
	};

	// def replyTTS

	Client.prototype.replyTTS = function replyTTS(where, content) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

		return new Promise(function (resolve, reject) {
			self.reply(where, content, { tts: true }).then(function (m) {
				callback(null, m);
				resolve(m);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def deleteMessage

	Client.prototype.deleteMessage = function deleteMessage(msg) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (e) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {
			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			self.internal.deleteMessage(msg, options).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	//def updateMessage

	Client.prototype.updateMessage = function updateMessage(msg, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err, msg) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {
			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}

			self.internal.updateMessage(msg, content, options).then(function (msg) {
				callback(null, msg);
				resolve(msg);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def getChannelLogs

	Client.prototype.getChannelLogs = function getChannelLogs(where) {
		var limit = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err, logs) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {
			if (typeof options === "function") {
				// options is the callback
				callback = options;
			}
			self.internal.getChannelLogs(where, limit, options).then(function (logs) {
				callback(null, logs);
				resolve(logs);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def sendFile

	Client.prototype.sendFile = function sendFile(where, attachment) {
		var name = arguments.length <= 2 || arguments[2] === undefined ? "image.png" : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err, m) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {
			self.internal.sendFile(where, attachment, name).then(function (m) {
				callback(null, m);
				resolve(m);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	Client.prototype.createServer = function createServer(name) {
		var region = arguments.length <= 1 || arguments[1] === undefined ? "london" : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, srv) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {
			self.internal.createServer(name, region).then(function (srv) {
				callback(null, srv);
				resolve(srv);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def leaveServer

	Client.prototype.leaveServer = function leaveServer(server) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err) {} : arguments[1];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.leaveServer(server).then(function () {
				callback();resolve();
			})["catch"](function (e) {
				callback(e);reject(e);
			});
		});
	};

	// def createChannel

	Client.prototype.createChannel = function createChannel(server, name) {
		var type = arguments.length <= 2 || arguments[2] === undefined ? "text" : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err, channel) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {
			if (typeof type === "function") {
				// options is the callback
				callback = type;
			}
			self.internal.createChannel(server, name, type).then(function (channel) {
				callback(channel);resolve(channel);
			})["catch"](function (e) {
				callback(e);reject(e);
			});
		});
	};

	// def deleteChannel

	Client.prototype.deleteChannel = function deleteChannel(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err) {} : arguments[1];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.deleteChannel(channel).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);reject(e);
			});
		});
	};

	//def banMember

	Client.prototype.banMember = function banMember(user, server) {
		var length = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {
			if (typeof length === "function") {
				// length is the callback
				callback = length;
			}
			self.internal.banMember(user, server, length).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);reject(e);
			});
		});
	};

	//def createRole

	Client.prototype.createRole = function createRole(server) {
		var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, res) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {
			if (typeof data === "function") {
				// data is the callback
				callback = data;
			}
			self.internal.createRole(server, data).then(function (role) {
				callback(null, role);
				resolve(role);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	//def deleteRole

	Client.prototype.deleteRole = function deleteRole(role) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err) {} : arguments[1];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.deleteRole(role).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	//def addMemberToRole

	Client.prototype.addMemberToRole = function addMemberToRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.addMemberToRole(member, role).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def addUserToRole

	Client.prototype.addUserToRole = function addUserToRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err) {} : arguments[2];

		return this.addMemberToRole(member, role, callback);
	};

	// def removeMemberFromRole

	Client.prototype.removeMemberFromRole = function removeMemberFromRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.removeMemberFromRole(member, role).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def removeUserFromRole

	Client.prototype.removeUserFromRole = function removeUserFromRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err) {} : arguments[2];

		return this.removeUserFromRole(member, role, callback);
	};

	// def createInvite

	Client.prototype.createInvite = function createInvite(chanServ, options) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, invite) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {
			if (typeof options === "function") {
				// length is the callback
				callback = options;
			}

			self.internal.createInvite(chanServ, options).then(function (invite) {
				callback(null, invite);
				resolve(invite);
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def overwritePermissions

	Client.prototype.overwritePermissions = function overwritePermissions(channel, role) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.overwritePermissions(channel, role, options).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	// def setTopic

	Client.prototype.setTopic = function setTopic(channel, topic) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.setTopic(channel, topic).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	//def setChannelName

	Client.prototype.setChannelName = function setChannelName(channel, topic) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.setChannelName(channel, topic).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	//def setChannelNameAndTopic

	Client.prototype.setChannelNameAndTopic = function setChannelNameAndTopic(channel, name, topic) {
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err) {} : arguments[3];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.setChannelNameAndTopic(channel, name, topic).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	//def updateChannel

	Client.prototype.updateChannel = function updateChannel(channel, data) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err) {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.updateChannel(channel, data).then(function () {
				callback();
				resolve();
			})["catch"](function (e) {
				callback(e);
				reject(e);
			});
		});
	};

	//def joinVoiceChannel

	Client.prototype.joinVoiceChannel = function joinVoiceChannel(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err) {} : arguments[1];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.internal.joinVoiceChannel(channel).then(function (chan) {
				callback(null, chan);
				resolve(chan);
			})["catch"](function (err) {
				callback(err);
				reject(err);
			});
		});
	};

	_createClass(Client, [{
		key: "users",
		get: function get() {
			return this.internal.users;
		}
	}, {
		key: "channels",
		get: function get() {
			return this.internal.channels;
		}
	}, {
		key: "servers",
		get: function get() {
			return this.internal.servers;
		}
	}, {
		key: "privateChannels",
		get: function get() {
			return this.internal.private_channels;
		}
	}]);

	return Client;
})(EventEmitter);

module.exports = Client;