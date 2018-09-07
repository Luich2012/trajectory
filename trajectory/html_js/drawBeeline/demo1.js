
//线条
var setline = {
    html: 'div',
    style: {
        "position": 'absolute',
        "borderBottom": '2px solid #ccc',
        "left": '0px',
        "top": '0px',
        "width": '0px',
        "transform-origin": "0% 50%",
        "transform": "rotate(0deg)"
    }
};

//画线
var Line = function(){
    
    this.drawLine = function(){
        
        var setLine = setline;
        
        var clientX = [0,0];       //绘制坐标
        
        var clientY = [0,0];
        
        var mousedownFlat = mouseoverFlat =  false;
        
        function getstart(_event){    //获取起起始值
            
            mousedownFlat = true;
            
            clientX[0] = _event.clientX;
            
            clientY[0] = _event.clientY;
            
        }
        
        function getend(_event){    //获取结束值
            
            if( mousedownFlat ){
                
                mouseoverFlat = true;
                
                clientX[1] = _event.clientX;
                
                clientY[1] = _event.clientY;
                
            }
            
        }
        
        function createline(){    //绘制图形
            
            if( mouseoverFlat ){
                
                var key,
                    a = clientX[1] - clientX[0],
                    b = clientY[1] - clientY[0],
                    line = document.createElement(setLine.html);  //创建标签
                
                for(key in setLine.style){ //设置样式
                    
                    switch( key ){
                        
                        case 'width' :
                            
                            var c = Math.sqrt(Math.pow(Math.abs(a), 2) + Math.pow(Math.abs(b), 2));
                            
                            setLine.style.width = c + 'px';
                            
                            break;
                        case 'top'  :
                            
                            setLine.style.top = clientY[0] + 'px';
                            
                            break;
                        case 'left' :
                            
                            setLine.style.left  =  clientX[0] + 'px';
                            
                            break;
                        case 'transform' :
                            
                            var jiaodu = Math.atan2(b, a);
                            
                            var x = 180 * jiaodu / Math.PI;
                            
                            setLine.style.transform = "rotate(" + x + "deg)";
                            
                            break;
                        default :
                            
                            break;
                    }
                    
                    line.style[key] = setLine.style[key];
                }
                
                document.body.appendChild(line); //向节点追加标签
                
                mousedownFlat = mouseoverFlat =  false
            }
        }
        
        //点击  获取起始值
        
        document.body.addEventListener('mousedown', getstart , false);
        
        //拖动  获取结束值
        
        document.body.addEventListener('mousemove', getend , false);
        
        //松开  绘制图形
        
        document.body.addEventListener('mouseup', createline , false);
        
    }
    
};