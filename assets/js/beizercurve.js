/**
* Animates bezier-curve
* 
*/
/**
* Draws a splitted (portion of) bezier-curve
* 
* @param ctx       The canvas context to draw to
* @param x0        The x-coord of the start point
* @param y0        The y-coord of the start point
* @param x1        The x-coord of the control point
* @param y1        The y-coord of the control point
* @param x2        The x-coord of the end point
* @param y2        The y-coord of the end point
* @param t0        The start ratio of the splitted bezier from 0.0 to 1.0
* @param t1        The start ratio of the splitted bezier from 0.0 to 1.0
*/
'use strict';
function drawBezierSplit(ctx, x0, y0, x1, y1, x2, y2, t0, t1) {
    ctx.beginPath();
    if( 0.0 == t0 && t1 == 1.0 ) {
        ctx.moveTo( x0, y0 );
        ctx.quadraticCurveTo( x1, y1, x2, y2 );
    } else if( t0 != t1 ) {
        var t00 = t0 * t0,
            t01 = 1.0 - t0,
            t02 = t01 * t01,
            t03 = 2.0 * t0 * t01;
        var nx0 = t02 * x0 + t03 * x1 + t00 * x2,
            ny0 = t02 * y0 + t03 * y1 + t00 * y2;
        t00 = t1 * t1;
        t01 = 1.0 - t1;
        t02 = t01 * t01;
        t03 = 2.0 * t1 * t01;
        var nx2 = t02 * x0 + t03 * x1 + t00 * x2,
            ny2 = t02 * y0 + t03 * y1 + t00 * y2;
        var nx1 = lerp ( lerp ( x0 , x1 , t0 ) , lerp ( x1 , x2 , t0 ) , t1 ),
            ny1 = lerp ( lerp ( y0 , y1 , t0 ) , lerp ( y1 , y2 , t0 ) , t1 );
        ctx.moveTo( nx0, ny0 );
        ctx.quadraticCurveTo( nx1, ny1, nx2, ny2 );
    }
    ctx.stroke();
    ctx.closePath();
}

/**
* Linearly interpolate between two numbers v0, v1 by t
*/
function lerp(v0, v1, t) {
    return ( 1.0 - t ) * v0 + t * v1;
}

function randVal(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}




function randColor(){
    // generates random color string
    var vec="0123456789abcdef";
    var color="#";
    for(var i=0;i<6;i++){
        color+=vec[randVal(0,vec.length-1)];
    }
    return color;
}

function getPosition(e) {
    // get touches object if exists
    var w = canvas.width;
    var h = canvas.height;

    var touch = e.changedTouches;

    // calculate offset of canvas
    var offset = canvas.getBoundingClientRect();

    var scaleX = w / offset.width;
    var scaleY = h / offset.height;

    var offsetX = offset.left;
    var offsetY = offset.top;

    // get mouse position
    var x = e.clientX;
    var y = e.clientY;
    // get touches if available, otherwise get position from mouse event (default)
    if (touch) {
        x = touch[0].clientX;
        y = touch[0].clientY;
    }

    // return new position with calculated offsets
    return {
        x: (x - offsetX) * scaleX,
        y: (y - offsetY) * scaleY
    }
}
