cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        itemID: 0
    },

    // use this for initialization
    onLoad: function () {
    },

    setListView: function(listView) {
        this.listView = listView;
    },

    updateItem: function(tmplId, itemId, userName) {
        this.itemID = itemId;
        this.userName = userName;
        if (userName) {
            this.label.string = userName;
        } else {
            this.label.string = 'Tmpl#' + tmplId + ' Item#' + itemId;
        }
        
    },

    onClicked: function() {
        cc.log('Item.onClicked() is called');
        if (this.userName) {
            this.listView.clickedItem(this.itemID);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
