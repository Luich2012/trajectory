/*
*   功能，画沿二次贝塞尔曲线运动的小球
*        获得贝塞尔曲线的控制点
*        获得起点终点的坐标
*        监听选中事件
*
* */
var IMGWIDTH = 40;
var TOPWINDOW = 40;
var LEFTWINDOW = 80;
var imgsCanvas = {
    user: "img/user.png",
    sever: "img/sever.png"
};
var endpointName = ["user", "sever"];


function CreateTrajectory(option) {
    this.canvas1 = document.getElementById(option.canvas1Id);
    this.canvas2 = document.getElementById(option.canvas2Id);
    this.canvas3 = document.getElementById(option.canvas3Id);
    this.ctx1 = this.canvas1.getContext("2d");
    this.ctx2 = this.canvas2.getContext("2d");
    this.ctx3 = this.canvas3.getContext("2d");
    this.width = this.canvas1.width;
    this.height = this.canvas1.height;
    
    this.setPosition(option.data);
    
    this.draw();
    
    this.biaoji = {};
    this.drawState = {img: [],line: []};
    this.cishu = 1;
    this.isone = 1;
    this.state = true;
    
    var self = this;
    
    this.canvas3.addEventListener("mousemove", function (event) {
        var x = event.clientX - self.canvas3.getBoundingClientRect().left;
        var y = event.clientY - self.canvas3.getBoundingClientRect().top;
        self.drawStatus(x, y);
    });
    this.canvas3.addEventListener('click', option.canvas3ClickFunction.bind(self));
}

CreateTrajectory.prototype.drawStatus = function (x, y) {
    this.ctx3.clearRect(0, 0, this.width, this.height);
    this.selectState = {
        id: "",
        style: ""
    };
    var self = this;
    var falg = true;
    $.each(this.drawState.img, function (index, value) {
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
    $.each(this.drawState.line, function (index, value) {
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

CreateTrajectory.prototype.draw = function () {
    for (var i = 0; i < this.data.length; i++) {
        this.ctx2.beginPath();
        
        this.ctx2.moveTo(this.data[i].start[0], this.data[i].start[1]);
        // 曲线
        this.ctx2.bezierCurveTo(this.data[i].ctrlA[0], this.data[i].ctrlA[1], this.data[i].ctrlB[0], this.data[i].ctrlB[1], this.data[i].end[0], this.data[i].end[1]);
        
        this.ctx2.strokeStyle = '#777';
        
        this.ctx2.stroke();
        
        if (this.state) {
            this.drawState.line.push(this.data[i]);
        }
    }
    this.state = false;
};

CreateTrajectory.prototype.drawBall = function(id, color, cj) {
    // 判断是否是回调
    // 如果是回调产生的调用，可以继续循环；
    // 如果是接口调用，除非所有的循环都已经结束，否则不允许开始新的循环。
    this.cishu = cj !== undefined ? 1 : 0;
    
    this.ctx2.clearRect(0, 0, this.width, this.height);
    
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

CreateTrajectory.prototype.isbiaoji = function() {
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

CreateTrajectory.prototype.getItem = function(id) {
    for (var i = 0; i < this.data.length; i++) {
        var ci = "id" + this.data[i].id;
        if (ci === id) {
            return this.data[i];
        }
    }
};

CreateTrajectory.prototype.addcircle = function(ci, cj) {
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
        self.ctx2.beginPath();
        self.ctx2.arc(ballX, ballY, 5, 0, Math.PI * 2, false);
        self.ctx2.fillStyle = this.biaoji[ci][cj].color;
        self.ctx2.fill();
    }
};

CreateTrajectory.prototype.setPosition = function(data) {
    var self = this;
    
    var objData = this.calculatingPosition(data);
    
    $.each(imgsCanvas, function (index, value) {
        var imgs = document.createElement("img");
        imgs.src = value;
        imgs.onload = function () {
            $.each(objData[index], function (i, text) {
                self.ctx1.drawImage(imgs, text.position[0], text.position[1], IMGWIDTH, IMGWIDTH);
                self.drawState.img.push({
                    img: imgs,
                    x: text.position[0],
                    y: text.position[1],
                    width: IMGWIDTH,
                    id: text.id,
                    style: index
                });
            });
        };
    });
    
    this.data = this.getCtrl(objData);
    console.log(objData);
    console.log(this.data);
};

CreateTrajectory.prototype.calculatingPosition = function(data) {
    var bottomWindow = TOPWINDOW + IMGWIDTH;
    var objData = {};
    objData[endpointName[0]] = [];
    objData[endpointName[1]] = [];
    var self = this;
    var minInterval = Math.floor(IMGWIDTH / 2);
    
    var width = this.width - LEFTWINDOW * 3 / 2;
    var indexs = Math.floor((width - IMGWIDTH) / (IMGWIDTH + minInterval));
    
    $.each(data[endpointName[0]], function (index, value) {
        var left_w, top_h;
        objData[endpointName[0]][index] = value;
        if (indexs < data[endpointName[0]].length) {
            var peishu = Math.floor(index / indexs);
            left_w = LEFTWINDOW + index * minInterval + index * IMGWIDTH - peishu * (indexs * minInterval + indexs * IMGWIDTH);
            top_h = TOPWINDOW + peishu * minInterval + peishu * IMGWIDTH;
        } else {
            left_w = LEFTWINDOW + index * minInterval + index * IMGWIDTH;
            top_h = TOPWINDOW;
        }
        objData[endpointName[0]][index].position = [left_w, top_h];
    });
    
    $.each(data[endpointName[1]], function (index, value) {
        var left_w, top_h;
        objData[endpointName[1]][index] = value;
        if (indexs < data[endpointName[1]].length) {
            var peishu = Math.floor(index / indexs);
            left_w = LEFTWINDOW + index * minInterval + index * IMGWIDTH - peishu * (indexs * minInterval + indexs * IMGWIDTH);
            top_h = self.height - (bottomWindow + peishu * minInterval + peishu * IMGWIDTH);
            
        } else {
            left_w = LEFTWINDOW + index * minInterval + index * IMGWIDTH;
            top_h = self.height - bottomWindow;
        }
        objData[endpointName[1]][index].position = [left_w, top_h];
    });
    return objData;
};

CreateTrajectory.prototype.getCtrl = function (data) {
    var imgwidth = IMGWIDTH;
    var leftwindow = LEFTWINDOW;
    var objData = [];
    var self = this;
    $.each(data[endpointName[0]], function (index, value) {
        $.each(value.links, function (i, text) {
            var mdata = {};
            mdata.start = [value.position[0] + imgwidth / 2, value.position[1] + imgwidth / 2];
            mdata.id = value.id + "-" + text;
            var sever = self.getDataItem(data[endpointName[1]], text);
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
};

CreateTrajectory.prototype.getDataItem = function(data, id) {
    var dataobj;
    $.each(data, function (index, value) {
        if (value.id === id) {
            dataobj = value;
            return false;
        }
    });
    return dataobj;
};