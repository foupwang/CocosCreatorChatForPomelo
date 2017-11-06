cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',

        edtIP: cc.EditBox,
        edtPort: cc.EditBox,
        edtUserName: cc.EditBox,
        edtRoomName: cc.EditBox,

    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;

        this.serverIP = "127.0.0.1";
        this.serverPort = "3014";
        

        this.edtIP.string = this.serverIP;
        this.edtPort.string = this.serverPort;

    },

    // called every frame
    update: function (dt) {

    },

    join: function() {
        cc.log("login");

        Global.serverIP = this.edtIP.string;
        Global.serverPort = this.edtPort.string;
        Global.userName = this.edtUserName.string;
        Global.roomName = this.edtRoomName.string;

        cc.log("login: join() is called. userName: " +Global.userName +", roomName: " +Global.roomName);

        cc.director.loadScene("chat");
    },

    

});
