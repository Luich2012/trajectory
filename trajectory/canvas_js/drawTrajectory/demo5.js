
function LinearGradient(option) {
    this.canvas = document.getElementById(option.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.data = option.data;
    
    this.draw();
    
    this.biaoji = {};
    this.cishu = 1;
    this.isone = 1;
}

LinearGradient.prototype.draw = function () {
    for (var i = 0; i < this.data.length; i++) {
        this.ctx.beginPath();
        
        this.ctx.moveTo(this.data[i].start[0], this.data[i].start[1]);
        // 曲线
        this.ctx.bezierCurveTo(this.data[i].ctrlA[0], this.data[i].ctrlA[1], this.data[i].ctrlB[0], this.data[i].ctrlB[1], this.data[i].end[0], this.data[i].end[1]);
        
        this.ctx.strokeStyle = '#777';
        
        this.ctx.stroke();
    }
};

LinearGradient.prototype.drawBall = function(id, cj) {
    // 判断是否是回调
    // 如果是回调产生的调用，可以继续循环；
    // 如果是接口调用，除非所有的循环都已经结束，否则不允许开始新的循环。
    this.cishu = cj !== undefined ? 1 : 0;
    
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // id为数字时容易出bug，将其转变为字符串，用id作为一个标记使用。
    var circlei = /id/.test(id) ? id : "id" + id;
    
    if (this.biaoji[circlei] === undefined) {
        this.biaoji[circlei] = [];
    }
    
    var circlej = cj ? cj : this.biaoji[circlei].length;
    
    if (this.biaoji[circlei][circlej] === undefined) {
        this.biaoji[circlei][circlej] = 0;
    }
    
    // 重绘曲线
    this.draw();
    
    // console.log(this.biaoji);
    
    for (var key in this.biaoji) {
        for (var i = 0; i < this.biaoji[key].length; i++) {
            this.addcircle(key, i);
        }
    }
    
    if (this.isbiaoji(this.biaoji) && (this.cishu === 1 || this.isone === 1)) {
        // 存储的正在运动的点 “this.biaoji” 存在正在运行的点时，不允许重新开始循环调用。
        this.isone = 0;
        window.requestAnimationFrame(this.drawBall.bind(this, circlei, circlej));
    } else if (!this.isbiaoji(this.biaoji)) {
        // 存储的正在运动的点 “this.biaoji” 清空后，将可重新开始标记 this.isone 设置为可重新开始 “1”
        this.isone = 1;
    }
};

LinearGradient.prototype.isbiaoji = function(obj) {
    for (var key in obj) {
        for (var i = 0; i < obj[key].length; i++) {
            if (obj[key][i] < 1) {
                return true;
            }
        }
    }
    return false;
};

LinearGradient.prototype.getItem = function(id) {
    for (var i = 0; i < this.data.length; i++) {
        var ci = "id" + this.data[i].id;
        if (ci === id) {
            return this.data[i];
        }
    }
};

LinearGradient.prototype.addcircle = function(ci, cj) {
    var self = this;
    var item = this.getItem(ci);
    var ctrlAx = item.ctrlA[0],
        ctrlAy = item.ctrlA[1],
        ctrlBx = item.ctrlB[0],
        ctrlBy = item.ctrlB[1],
        x = item.end[0],
        y = item.end[1],
        ox = item.start[0],
        oy = item.start[1];
    
    if (this.biaoji[ci][cj] > 1) {
        self.ctx.clearRect(x - 5, y - 5, 10, 10);
    } else {
        this.biaoji[ci][cj] += item.speed;
        var t = this.biaoji[ci][cj];
        var ballX = ox * Math.pow((1 - t), 3) + 3 * ctrlAx * t * Math.pow((1 - t), 2) + 3 * ctrlBx * Math.pow(t, 2) * (1 - t) + x * Math.pow(t, 3);
        var ballY = oy * Math.pow((1 - t), 3) + 3 * ctrlAy * t * Math.pow((1 - t), 2) + 3 * ctrlBy * Math.pow(t, 2) * (1 - t) + y * Math.pow(t, 3);
        self.ctx.beginPath();
        self.ctx.arc(ballX, ballY, 5, 0, Math.PI * 2, false);
        self.ctx.fillStyle = 'red';
        self.ctx.fill();
    }
};


function setPosition(obj) {
    var canvas = document.getElementById(obj.canvasId);
    var ctx = canvas.getContext("2d");
    var data = obj.data;
    
    var setting = {
        imgwidth: 50,
        topWindow: 40,
        leftWindow: 100,
        width: canvas.width,
        height: canvas.height
    };
    setting.bottomWindow = setting.topWindow + setting.imgwidth;
    
    var sever_imgs = document.createElement("img");
    sever_imgs.src = "img/sever.png";
    
    var user_imgs = document.createElement("img");
    user_imgs.src = "img/user.png";
    
    var objData = calculatingPosition(data, setting);
    
    sever_imgs.onload = function () {
        $.each(objData.sever, function (index, value) {
            ctx.drawImage(sever_imgs, value.position[0], value.position[1], setting.imgwidth, setting.imgwidth);
        });
    };
    
    user_imgs.onload = function () {
        $.each(objData.user, function (index, value) {
            ctx.drawImage(user_imgs, value.position[0], value.position[1], setting.imgwidth, setting.imgwidth);
        });
    };
    
    return objData;
}

function calculatingPosition(data, setting) {
    var objData = {user: [], sever:[]};
    var minInterval = Math.floor(setting.imgwidth / 2);
    
    var width = setting.width - setting.leftWindow * 2;
    var indexs = Math.floor((width - setting.imgwidth) / (setting.imgwidth + minInterval));
    
    $.each(data.user, function (index, value) {
        var left_w, top_h;
        objData.user[index] = value;
        if (indexs < data.user.length) {
            var peishu = Math.floor(index / indexs);
            left_w = setting.leftWindow + index * minInterval + index * setting.imgwidth - peishu * (indexs * minInterval + indexs * setting.imgwidth);
            top_h = setting.topWindow + peishu * minInterval + peishu * setting.imgwidth;
        } else {
            left_w = setting.leftWindow + index * minInterval + index * setting.imgwidth;
            top_h = setting.topWindow;
        }
        objData.user[index].position = [left_w, top_h];
    });
    
    $.each(data.sever, function (index, value) {
        var left_w, top_h;
        objData.sever[index] = value;
        if (indexs < data.sever.length) {
            var peishu = Math.floor(index / indexs);
            left_w = setting.leftWindow + index * minInterval + index * setting.imgwidth - peishu * (indexs * minInterval + indexs * setting.imgwidth);
            top_h = setting.height - (setting.bottomWindow + peishu * minInterval + peishu * setting.imgwidth);
            
        } else {
            left_w = setting.leftWindow + index * minInterval + index * setting.imgwidth;
            top_h = setting.height - setting.bottomWindow;
        }
        objData.sever[index].position = [left_w, top_h];
    });
    return objData;
}

function getCtrl(data) {
    var imgwidth = 50;
    var objData = [];
    $.each(data.user, function (index, value) {
        $.each(value.links, function (i, text) {
            var mdata = {};
            mdata.start = [value.position[0] + imgwidth / 2, value.position[1] + imgwidth / 2];
            mdata.id = value.id + "-" + text;
            var sever = getItem(data.sever, text);
            mdata.end = [sever.position[0] + imgwidth / 2, sever.position[1] + imgwidth / 2];
            
            mdata.ctrlA = [];
            mdata.ctrlB = [];
            
            if ((mdata.start[0] - mdata.end[0]) > (imgwidth + Math.floor(imgwidth / 2))) {
                mdata.ctrlA[0] = ((mdata.start[0] + mdata.end[0]) / 3) * 2 - ((mdata.start[0] - mdata.end[0]) / 3) * 2;
                mdata.ctrlB[0] = (mdata.start[0] + mdata.end[0]) / 3 - (mdata.start[0] - mdata.end[0]) / 3;
            } else if ((mdata.end[0] - mdata.start[0]) > (imgwidth + Math.floor(imgwidth / 2))) {
                mdata.ctrlA[0] = (mdata.start[0] + mdata.end[0]) / 3 - (mdata.end[0] - mdata.start[0]) / 3;
                mdata.ctrlB[0] = ((mdata.start[0] + mdata.end[0]) / 3) * 2 - ((mdata.end[0] - mdata.start[0]) / 3) * 2;
            } else {
                mdata.ctrlA[0] = (mdata.start[0] + mdata.end[0]) / 2 - 100;
                mdata.ctrlB[0] = (mdata.start[0] + mdata.end[0]) / 2 - 100;
            }
            
            mdata.ctrlA[1] = (mdata.start[1] + mdata.end[1]) / 3;
            mdata.ctrlB[1] = ((mdata.start[1] + mdata.end[1]) / 3) * 2;
            
            mdata.speed = 0.005;
            
            objData.push(mdata);
        });
    });
    console.log(objData);
    return objData;
}

function getItem(data, id) {
    var dataobj;
    $.each(data, function (index, value) {
        if (value.id === id) {
            dataobj = value;
            return false;
        }
    });
    return dataobj;
}