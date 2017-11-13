cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Prefab
        },
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        spacing: 0, // 项之间的间隔大小
    },

    // use this for initialization
    onLoad: function () {
    	this.content = this.scrollView.content;
        this.items = []; // 存储实际创建的项数组
        this.updateTimer = 0;  
        this.updateInterval = 0.2;
        this.itemHeight = 0;
        // 使用这个变量来判断滚动操作是向上还是向下
        this.lastContentPosY = 0; 
    },

    // 根据用户名刷新ListView
    loadByUsers: function (users) {
        if (users.length <= 0) {
            cc.log('UserListView.loadByUsers(): users length is 0');
            return;
        }

        let tempItem = cc.instantiate(this.itemTemplate);
        this.itemHeight = tempItem.height;
        
        this.users = users;
        // 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
        this.bufferZone = users.length * (this.itemHeight + this.spacing) / 2;

        this.items = [];
        this.content.removeAllChildren();

        // 获取整个列表的高度
        this.content.height = users.length * (this.itemHeight + this.spacing) + this.spacing;
    	for (let i = 0; i < users.length; ++i) { // spawn items, we only need to do this once
    		let item = cc.instantiate(this.itemTemplate);
            this.content.addChild(item);
            // 设置该item的坐标（注意父节点content的Anchor坐标是(0.5, 1)，所以item的y坐标总是负值）
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            
            let userName = '';
            if (this.users) {
                userName = this.users[i];
            }
            
            let coItem = item.getComponent('Item');
            coItem.setListView(this);
            coItem.updateItem(i, i, userName);
            
            this.items.push(item);
    	}
    },

    show: function() {
        this.node.active = true;
    },

    hide: function() {
        this.node.active = false;
    },

    setChat: function(chat) {
        this.chat = chat;
    },

    clickedItem: function(itemId) {
        cc.log('UserListView.clickedItem: itemId=' +itemId);
        this.chat.chooseUser(itemId);
    },

    // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // 每帧调用一次。根据滚动位置动态更新item的坐标和显示
    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.items;
        // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
        let isDown = this.scrollView.content.y < this.lastContentPosY;
        // 实际创建项占了多高（即它们的高度累加）
        let offset = (this.itemHeight + this.spacing) * items.length;
        let newY = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // 提前计算出该item的新的y坐标
                newY = items[i].y + offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    items[i].setPositionY(newY);
                    let item = items[i].getComponent('Item');
                    let itemId = item.itemID - items.length; // update item id
                    let userName = '';
                    if (this.users) {
                        userName = this.users[itemId];
                    }
                    item.updateItem(i, itemId, userName);
                }
            } else {
                // 提前计算出该item的新的y坐标
                newY = items[i].y - offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y > this.bufferZone && newY > -this.content.height) {
                    items[i].setPositionY(newY);
                    let item = items[i].getComponent('Item');
                    let itemId = item.itemID + items.length;
                    let userName = '';
                    if (this.users) {
                        userName = this.users[itemId];
                    }
                    item.updateItem(i, itemId, userName);
                }
            }
        }

        // 更新lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;
    },

});
