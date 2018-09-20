/*
*   功能，画沿二次贝塞尔曲线运动的小球
*        获得贝塞尔曲线的控制点
*        获得起点终点的坐标
*
* */
const IMGWIDTH = 40;
const TOPWINDOW = 40;
const LEFTWINDOW = 80;
const SEVERIMGS = "img/sever.png";
const USERIMGS = "img/user.png";


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
    this.state = true;
    
    var self = this;
    this.canvas3 = document.getElementById(option.canvas3Id);
    this.ctx3 = this.canvas3.getContext("2d");
    
    this.canvas3.addEventListener("mousemove", function (event) {
        var x = event.clientX - self.canvas3.getBoundingClientRect().left;
        var y = event.clientY - self.canvas3.getBoundingClientRect().top;
        self.drawStatus(x, y);
    });
    this.canvas3.addEventListener('click', option.canvas3ClickFunction.bind(self));
}

LinearGradient.prototype.drawStatus = function (x, y) {
    this.ctx3.clearRect(0, 0, this.width, this.height);
    this.selectState = {
        id: "",
        style: ""
    };
    var self = this;
    var falg = true;
    $.each(drawState.img, function (index, value) {
        // console.log(value);
        // self.ctx3.drawImage(value.img, value.x, value.y, value.imgwidth, value.imgwidth);
        self.ctx3.beginPath();
        self.ctx3.arc(value.x + value.width / 2, value.y + value.width / 2, value.width / 2, 0, 2*Math.PI);
        if (self.ctx3.isPointInPath(x, y)) {
            self.ctx3.drawImage(value.img, value.x, value.y, value.width + 5, value.width + 5);
            self.ctx3.beginPath();
            self.ctx3.arc(x, y, 7, 0, 2*Math.PI);
            self.ctx3.fillStyle = "red";
            self.ctx3.fill();
            falg = false;
            self.selectState.id = value.id;
            self.selectState.style = value.style;
            return false;
        }
    });
    if (!falg) {
        return;
    }
    $.each(drawState.line, function (index, value) {
        self.ctx3.lineWidth = 2;
        
        self.ctx3.beginPath();
    
        self.ctx3.moveTo(value.start[0], value.start[1]);
        // 曲线
        self.ctx3.bezierCurveTo(value.ctrlA[0], value.ctrlA[1], value.ctrlB[0], value.ctrlB[1], value.end[0], value.end[1]);
        
        if (self.ctx3.isPointInStroke(x, y)) {
            self.ctx3.strokeStyle = 'red';
            self.ctx3.stroke();
            self.ctx3.beginPath();
            self.ctx3.arc(x, y, 7, 0, 2*Math.PI);
            self.ctx3.fillStyle = "red";
            self.ctx3.fill();
            self.selectState.id = value.id;
            self.selectState.style = "line";
            return false;
        }
    })
};

LinearGradient.prototype.draw = function () {
    for (var i = 0; i < this.data.length; i++) {
        this.ctx.beginPath();
        
        this.ctx.moveTo(this.data[i].start[0], this.data[i].start[1]);
        // 曲线
        this.ctx.bezierCurveTo(this.data[i].ctrlA[0], this.data[i].ctrlA[1], this.data[i].ctrlB[0], this.data[i].ctrlB[1], this.data[i].end[0], this.data[i].end[1]);
        
        this.ctx.strokeStyle = '#777';
        
        this.ctx.stroke();
        
        if (this.state) {
            drawState.line.push(this.data[i]);
        }
    }
    this.state = false;
};

LinearGradient.prototype.drawBall = function(id, color, cj) {
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
    
    var circlej = (cj || cj === 0) ? cj : this.biaoji[circlei].length;
    
    if (this.biaoji[circlei][circlej] === undefined) {
        this.biaoji[circlei][circlej] = {
            index: 0,
            // 可设定颜色，默认为“red”。
            color: color ? color : "red",
            // 如果同一个路径上的小球越多，小球运动的速度越快。最快不超过0.2步。
            speed: (0.005 + circlej * 0.002) > 0.2 ? 0.2 : (0.005 + circlej * 0.002)
        };
        
    }
    
    // 重绘曲线
    this.draw();
    
    // console.log(this.biaoji);
    // 重绘圆点
    for (var key in this.biaoji) {
        for (var i = 0; i < this.biaoji[key].length; i++) {
            this.addcircle(key, i);
        }
    }
    
    if (this.isbiaoji() && (this.cishu === 1 || this.isone === 1)) {
        // 存储的正在运动的点 “this.biaoji” 存在正在运行的点时，不允许重新开始循环调用。
        this.isone = 0;
        window.requestAnimationFrame(this.drawBall.bind(this, circlei, color, circlej));
    } else if (!this.isbiaoji()) {
        // 存储的正在运动的点 “this.biaoji” 清空后，将可重新开始标记 this.isone 设置为可重新开始 “1”
        this.isone = 1;
    }
};

LinearGradient.prototype.isbiaoji = function() {
    var obj = this.biaoji;
    for (var key in obj) {
        for (var i = 0; i < obj[key].length; i++) {
            if (obj[key][i].index < 1) {
                return true;
            }
        }
    }
    this.biaoji = {};
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
    
    if (this.biaoji[ci][cj].index > 1) {
        this.biaoji[ci].splice(ci, 1);
    } else {
        this.biaoji[ci][cj].index += this.biaoji[ci][this.biaoji[ci].length - 1].speed;
        var t = this.biaoji[ci][cj].index;
        var ballX = ox * Math.pow((1 - t), 3) + 3 * ctrlAx * t * Math.pow((1 - t), 2) + 3 * ctrlBx * Math.pow(t, 2) * (1 - t) + x * Math.pow(t, 3);
        var ballY = oy * Math.pow((1 - t), 3) + 3 * ctrlAy * t * Math.pow((1 - t), 2) + 3 * ctrlBy * Math.pow(t, 2) * (1 - t) + y * Math.pow(t, 3);
        self.ctx.beginPath();
        self.ctx.arc(ballX, ballY, 5, 0, Math.PI * 2, false);
        self.ctx.fillStyle = this.biaoji[ci][cj].color;
        self.ctx.fill();
    }
};

var drawState = {
    img: [],
    line: []
};

function setPosition(obj) {
    var canvas = document.getElementById(obj.canvasId);
    var ctx = canvas.getContext("2d");
    var data = obj.data;
    
    var setting = {
        imgwidth: IMGWIDTH,
        topWindow: TOPWINDOW,
        leftWindow: LEFTWINDOW,
        width: canvas.width,
        height: canvas.height
    };
    setting.bottomWindow = setting.topWindow + setting.imgwidth;
    
    var sever_imgs = document.createElement("img");
    sever_imgs.src = SEVERIMGS;
    
    var user_imgs = document.createElement("img");
    user_imgs.src = USERIMGS;
    
    var objData = calculatingPosition(data, setting);
    
    sever_imgs.onload = function () {
        $.each(objData.sever, function (index, value) {
            ctx.drawImage(sever_imgs, value.position[0], value.position[1], setting.imgwidth, setting.imgwidth);
            drawState.img.push({
                img: sever_imgs,
                x: value.position[0],
                y: value.position[1],
                width: setting.imgwidth,
                id: value.id,
                style: "sever"
            })
        });
    };
    
    user_imgs.onload = function () {
        $.each(objData.user, function (index, value) {
            ctx.drawImage(user_imgs, value.position[0], value.position[1], setting.imgwidth, setting.imgwidth);
            drawState.img.push({
                img: user_imgs,
                x: value.position[0],
                y: value.position[1],
                width: setting.imgwidth,
                id: value.id,
                style: "user"
            })
        });
    };
    
    return objData;
}

function calculatingPosition(data, setting) {
    var objData = {user: [], sever:[]};
    var minInterval = Math.floor(setting.imgwidth / 2);
    
    var width = setting.width - setting.leftWindow * 3 / 2;
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
    // console.log(objData);
    return objData;
}

function getCtrl(data) {
    var imgwidth = IMGWIDTH;
    var leftwindow = LEFTWINDOW;
    var objData = [];
    $.each(data.user, function (index, value) {
        $.each(value.links, function (i, text) {
            var mdata = {};
            mdata.start = [value.position[0] + imgwidth / 2, value.position[1] + imgwidth / 2];
            mdata.id = value.id + "-" + text;
            var sever = getDataItem(data.sever, text);
            mdata.end = [sever.position[0] + imgwidth / 2, sever.position[1] + imgwidth / 2];
            
            mdata.ctrlA = [];
            mdata.ctrlB = [];
            
            if ((mdata.start[0] - mdata.end[0]) > (imgwidth + Math.floor(imgwidth / 2)) * 3) {
                mdata.ctrlA[0] = ((mdata.start[0] + mdata.end[0]) / 3) * 2 - ((mdata.start[0] - mdata.end[0]) / 3) * 2;
                mdata.ctrlB[0] = (mdata.start[0] + mdata.end[0]) / 3 - (mdata.start[0] - mdata.end[0]) / 3;
            } else if ((mdata.end[0] - mdata.start[0]) > (imgwidth + Math.floor(imgwidth / 2)) * 3) {
                mdata.ctrlA[0] = (mdata.start[0] + mdata.end[0]) / 3 - (mdata.end[0] - mdata.start[0]) / 3;
                mdata.ctrlB[0] = ((mdata.start[0] + mdata.end[0]) / 3) * 2 - ((mdata.end[0] - mdata.start[0]) / 3) * 2;
            } else {
                mdata.ctrlA[0] = mdata.start[0] - leftwindow;
                mdata.ctrlB[0] = mdata.end[0] - leftwindow;
            }
            
            mdata.ctrlA[1] = (mdata.start[1] + mdata.end[1]) / 3;
            mdata.ctrlB[1] = ((mdata.start[1] + mdata.end[1]) / 3) * 2;
            
            objData.push(mdata);
        });
    });
    // console.log(objData);
    return objData;
}

function getDataItem(data, id) {
    var dataobj;
    $.each(data, function (index, value) {
        if (value.id === id) {
            dataobj = value;
            return false;
        }
    });
    return dataobj;
}