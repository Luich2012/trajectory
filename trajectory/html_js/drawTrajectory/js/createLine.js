
function CreateLine(x1, y1, x2, y2, dom) {
    if (!(this instanceof CreateLine)) {
        return new CreateLine(x1, y1, x2, y2, dom);
    }
    this.clientX = [x1, x2];       //绘制坐标
    this.clientY = [y1, y2];
    this.pdom = dom;
    this.init();
}

$.extend(CreateLine, {
   
    lineStyle: {
        html: 'div',
        style: {
            "position": 'absolute',
            "borderBottom": '2px solid #ccc',
            "left": '0px',
            "top": '0px',
            "width": '0px',
            "transform-origin": "0% 50%",
            "transform": " "
        }
    },
    
    prototype: {
        init: function () {
            this.line = CreateLine.lineStyle;
            
            this.createBody();
        },
        getLineWidth: function () {
            var a = this.clientX[1] - this.clientX[0];
            var b = this.clientY[1] - this.clientY[0];
    
            var c = Math.sqrt(Math.pow(Math.abs(a), 2) + Math.pow(Math.abs(b), 2));
            this.line.style.width = c + 'px';
        },
        getLineTop: function () {
            this.line.style.top = this.clientY[0] + 'px';
        },
        getLineLeft: function () {
            this.line.style.left =  this.clientX[0] + 'px';
        },
        getLineTransform: function () {
            var a = this.clientX[1] - this.clientX[0];
            var b = this.clientY[1] - this.clientY[0];
    
            var jiaodu = Math.atan2(b, a);
    
            var x = 180*jiaodu/Math.PI;
    
            this.line.style.transform = "rotate(" + x + "deg)";
        },
        createBody: function() {    //绘制图形
            var xian = document.createElement(this.line.html);  //创建标签
            for(key in this.line.style){ //设置样式
                switch( key ){
                    case 'width' :
                        this.getLineWidth();
                        break;
                    case 'top'  :
                        this.getLineTop();
                        break;
                    case 'left' :
                        this.getLineLeft();
                        break;
                    case 'transform' :
                        this.getLineTransform();
                        break;
                    default :
                        break;
                }
                xian.style[key] = this.line.style[key];
            }
            document.getElementById(this.pdom).appendChild(xian); //向节点追加标签
        }
    }
    
});

function CreateAttack(x1, y1, x2, y2, dom) {
    if (!(this instanceof CreateAttack)) {
        return new CreateAttack(x1, y1, x2, y2, dom);
    }
    
    this.pdom = dom;
    this.clientX = [x1, x2];       //绘制坐标
    this.clientY = [y1, y2];
    
    this.init();
}

$.extend(CreateAttack, {
    
    circleStyle: {
        html: 'div',
        class: "attack-circle",
        style: {
            "left": '0px',
            "top": '0px'
        }
    },
    
    prototype: {
        init: function () {
            this.circle = CreateAttack.circleStyle;
            
            this.createBody();
        },
        
        createBody: function () {
            var circle = document.createElement(this.circle.html);  //创建标签
            for(key in this.circle.style){ //设置样式
                switch( key ){
                    case 'top'  :
                        this.circle.style.top = this.clientY[0] + 'px';
                        break;
                    case 'left' :
                        this.circle.style.left =  this.clientX[0] + 'px';
                        break;
                    default :
                        break;
                }
                circle.style[key] = this.circle.style[key];
            }
            circle.className = this.circle.class;
            this.mdom = circle;
            document.getElementById(this.pdom).appendChild(this.mdom); //向节点追加标签
        },
        
        animate: function (speed, easing) {
            $(this.mdom).animate({
                top: this.clientY[1] + 'px',
                left: this.clientX[1] + 'px'
            }, speed, easing, function () {
                this.remove()
            });
        }
    }
});

