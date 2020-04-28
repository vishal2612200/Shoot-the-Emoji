// Main Javascript File for Canvas Utilities

function ShootOutEmoji(){
    
    setTimeout(function(){
        document.getElementsByTagName('h3')[0].innerHTML = 'Shoot Out Emoji!';
    },10000);
    
    // Scoreboard POPUP utilities
    $('.hover_bkgr_fricc').click(function(){
        $('.hover_bkgr_fricc').hide();
    });
    $('.popupCloseButton').click(function(){
        $('.hover_bkgr_fricc').hide();
        newGame();
    });
    
    var topMessage = document.getElementById('top-message');
    var audioPlayer = document.getElementById('audio-player');

    topMessage.onclick = function(){
        topMessage.style.display = 'none';
        audioPlayer.style.display = 'block';
    }
    
    
    var canvas = document.getElementById('canvas');
    var btnNew = document.getElementById('btnNew');
    var btnPause = document.getElementById("btnPause");
    var selectDiff = document.getElementById("selectDiff");
    

    /*
    canvas.width = window.innerWidth*0.95;
    canvas.height = window.innerHeight*0.8;
    */

    var ctx = canvas.getContext('2d');
    var exp = new Explosion(ctx);
    btnNew.onclick = confirmBox;
    btnPause.onclick = pause;
    canvas.onclick = manual;
    canvas.ontouchmove = manual;
    // selectDiff.onchange = setDifficulty;
    var messages = [];
    var curves = [];
    var targets = [];
    var enemyFire = [];
    var targetStock = ["💩","😬","🤗","😈","🤯","😱","😂","😎","👺","🧟‍♂️","😭","😜","😛","😝","😤","😵","😁","😑","😚","😍","😠","😐","🙄"];
    var score = {};
    var gameSettings = {
        SHOT_DURATION:300,
        ENEMY_SIZE:30,
        G:2.0,
        poop_m:0.5
    };
    var War_Machine_Emojis = ["🛰","👨🏿‍💻","🌋","🦹‍♀️","📡"];
    var War_Machine_Emoji = War_Machine_Emojis[randVal(0, War_Machine_Emojis.length - 1)];
    
    randomCanvasColor();
    // Scoreboard Utilities
    /*
    document.getElementById("btnShowScore").onclick=function(){
        if(drawInterval){pause();}
       
    } 
    */
    var drawInterval = null;

    function setDifficulty(){
        gameSettings.DIFFICULTY = parseInt(selectDiff.value);
        switch(gameSettings.DIFFICULTY){
            case 1: // Easy
                gameSettings.ACTIVE_TARGETS=3;
                gameSettings.TARGET_LIMIT=10;
                gameSettings.SHOT_LIMIT=10;
                gameSettings.POOPABILITY=0.001;
                gameSettings.MAX_TARGET_SPEED=1;
            break;
            case 2: // Normal
                gameSettings.ACTIVE_TARGETS=3;
                gameSettings.TARGET_LIMIT=15;
                gameSettings.SHOT_LIMIT=5;
                gameSettings.POOPABILITY=0.005;
                gameSettings.MAX_TARGET_SPEED=1;
            break;
            case 3: // Hard
                gameSettings.ACTIVE_TARGETS=3;
                gameSettings.TARGET_LIMIT=15;
                gameSettings.SHOT_LIMIT=3;
                gameSettings.POOPABILITY=0.01;
                gameSettings.MAX_TARGET_SPEED=3;
            break;
            case 4: // eXtreme
                gameSettings.ACTIVE_TARGETS=10;
                gameSettings.TARGET_LIMIT=20;
                gameSettings.SHOT_LIMIT=3;
                gameSettings.POOPABILITY=0.02;
                gameSettings.MAX_TARGET_SPEED=8;
            break;
            case 5: // Aag
                gameSettings.ACTIVE_TARGETS=15;
                gameSettings.TARGET_LIMIT=20;
                gameSettings.SHOT_LIMIT=2;
                gameSettings.POOPABILITY=0.04;
                gameSettings.MAX_TARGET_SPEED=10;
            break;
            default:break;
        }
        gameSettings.GAME_OVER = false;
    }


    function vg() {
        var scoreboardpopstr = "<b>👹Game Over Dude,👹</b> <br><br> <b>Your Total Score is :</b>" + score.score + "<br><b> Hits: </b>"+score.hits +  "<br><b> Fired: </b>"+ score.fired + "<br><b> Missed: </b>" + score.miss +"<br><b> Hit % </b>" +Math.round((score.hits/score.fired)*100,2)+"%" + "<br><b> Score Streak: </b>" + score.streak +" "; 
     document.getElementById("scoreboardpop").innerHTML = scoreboardpopstr;
    }


    
    function newGame(){
        //if(!confirm("Starting New Game\nDifficulty: "+selectDiff.options[selectDiff.selectedIndex].text)){return;}
        
        setDifficulty();
        score = {
            health:100,
            hits:0,
            miss:0,
            fired:0,
            score:0,
            spawned:0,
            streak:0,
            addTarget:false
        }
        targets = [];
        enemyFire = [];
        messages = [];

        // btnNew.disabled=false;
    }

    function pause(){
        if(drawInterval){
            cancelAnimationFrame(drawInterval);
            // clearInterval(drawInterval);
            drawInterval = null;
            ctx.font="50px Times New Roman";
            ctx.fillStyle="red"; ctx.fillText("Paused",canvas.width*0.3,canvas.height/2);
            btnPause.innerHTML="Resume";
        }
        else{
            drawInterval = requestAnimationFrame(draw);
            // drawInterval = setInterval(draw, 33);
            btnPause.innerHTML="Pause";
        }
    }
 document.getElementById("randCanvasCol").onclick=randomCanvasColor;
    function randomCanvasColor(){
        canvas.style.background = "linear-gradient("+randColor()+","+randColor()+")";
    }
    
    function drawMessages(){
        for(var i=messages.length-1;i>=0;i--){
            var msg = messages[i];
            ctx.font = msg.size+"px "+msg.font;
            ctx.fillStyle = msg.color;
            ctx.fillText(msg.text, msg.x-20, msg.y);
            msg.ttl-=1000;
            if(msg.ttl<0)
                messages.splice(i,1);
        }
    }

    function drawScore(){
        ctx.font = "20px Times New Roman";
        
        ctx.fillStyle = 'white';
        ctx.fillText("Health: "+score.health+"%", 20,20);
        ctx.fillText("Score: "+score.score, 20,40);
        ctx.fillText("Hits: "+score.hits, 20,60);
        ctx.fillText("Fired: "+score.fired, 20,80);
        ctx.fillText("Missed: "+score.miss, 20,100);
        ctx.fillText("Hit %: "+Math.round((score.hits/score.fired)*100,2)+"%", 20,120);
        ctx.fillText("Streak: "+score.streak, 20,140);
    }

    function drawlaseremoji(){
        ctx.font = "80px Times New Roman";
        ctx.fillText(War_Machine_Emoji,canvas.width/2-40,canvas.height);
        ctx.strokeStyle="red";
        ctx.lineWidth=4;
        ctx.beginPath();
        ctx.moveTo(canvas.width*0.38,canvas.height);
        ctx.lineTo(canvas.width*0.38,canvas.height-30);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(canvas.width*0.65,canvas.height);
        ctx.lineTo(canvas.width*0.65,canvas.height-30);
        ctx.closePath();
        ctx.stroke();
    }

    function manual(evt){
        // draw line from bottom of the canvas to the point where the user clicked
        evt.preventDefault();
        
        if(!drawInterval){
            pause();
        }
        if(curves.length >= gameSettings.SHOT_LIMIT || score.health<=0 || !drawInterval){return;}
        
        var pos = getPosition(evt);
        
        var x = pos.x;
        var y = pos.y;
        var x0 = randVal(0,canvas.width),
            y0 = canvas.height,
            x1 = randVal(0,canvas.width),
            y1 = randVal(0,canvas.height);

        score.fired++;

        var duration = gameSettings.SHOT_DURATION;
        var size = 5;
        x0 = canvas.width/2;
        curves.push({
            x0:x0,
            y0:y0,
            x1:x1,
            y1:y1,
            x2:x,
            y2:y,
            duration:duration,
            color:randColor(),
            size:size,
            start:null,
            progress:0
        }); 
    }

    function updateCurves(){
        for(var i=0;i<curves.length;i++){
            if(curves[i].progress >= 1){
                exp.createExplosion(curves[i].x2,curves[i].y2,curves[i].color);
                curves.splice(i,1);
            }
        }
    }

    function drawCurves(){
        for(var i=0;i<curves.length;i++){
            drawCurve(curves[i]);
        }
    }

    function drawCurve(curve){
        // my convertion of animatePathDrawing() function
        var timestamp = window.performance.now();
        if(curve.start === null){
            curve.start = timestamp;
        }
        var delta = timestamp - curve.start;
        curve.progress = Math.min(delta / curve.duration, 1);
        ctx.fillStyle = curve.color;
        ctx.beginPath();
        ctx.arc(curve.x2,curve.y2,5,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        // set curve color and width
        ctx.strokeStyle = curve.color || "black";
        ctx.lineWidth = curve.size || 1;
        // Draw curve
        drawBezierSplit(ctx, curve.x0, curve.y0, curve.x1, curve.y1, curve.x2, curve.y2, 0, curve.progress);
    }

    function spawnTarget(){
        /*
        spawn random enemy
        */
        var x = Math.random()>0.5? 0:canvas.width;
        var dir = x === 0? 1:-1;
        var icon = targetStock[randVal(0,targetStock.length-1)];
        return {
            x:x-(dir*gameSettings.ENEMY_SIZE),
            y:randVal(20,canvas.height/2),
            dx:randVal(1,gameSettings.MAX_TARGET_SPEED),
            dy:gameSettings.DIFFICULTY<3? 0:randVal(1,gameSettings.MAX_TARGET_SPEED/2),
            yRange:randVal(3,gameSettings.MAX_TARGET_SPEED*3),
            yDist:0,
            yDir:Math.random()<0.5? 1:-1,
            dir:dir,
            size:gameSettings.ENEMY_SIZE,
            icon:icon
        };
    }

    function updateTargets(){
        /*
        update enemies movement and
        generate enemy fire
        */
        for(var i=0;i<targets.length;i++){
            var tar = targets[i];
            if(Math.random()<gameSettings.POOPABILITY){
                // spawn enemy fire
                enemyFire.push({
                    x:tar.x,
                    y:tar.y,
                    dx:tar.dx/5,
                    dy:gameSettings.DIFFICULTY,
                    poop_m:gameSettings.poop_m,
                    dir:tar.dir,
                    icon:(tar.icon=="💩")? targetStock[randVal(1,targetStock.length-1)]:"💩",
                    size:gameSettings.ENEMY_SIZE/2
                });
            }
            tar.x += tar.dx*tar.dir;
            
            if(Math.abs(tar.yDist)>=tar.yRange){ tar.yDir*=-1;}
            tar.yDist += tar.dy*tar.yDir;
            tar.y += tar.dy*tar.yDir;
                
            if(tar.x < -tar.size || tar.x > canvas.width+tar.size){
                targets.splice(i, 1);
                score.miss++;
            }
        }
    }

    function updateEnemyFire(){
        /*
        check if any enemy fire hit
        the War Machine
        */
        for(var i=enemyFire.length-1;i>=0;i--){
            var ef=enemyFire[i];
            ef.x+=ef.dx*ef.dir;
            ef.y+=ef.dy*ef.poop_m*gameSettings.G;
            if(ef.y>canvas.height){
                if(ef.x>canvas.width*0.38&&ef.x<canvas.width*0.65){
                   // War Machine hit detected
                    score.health=Math.max(score.health-10,0); exp.createExplosion(ef.x,ef.y-20,"orange");
                    exp.createExplosion(ef.x,ef.y-20,"red");
                    exp.createExplosion(ef.x,ef.y-20,"yellow");
                }
                enemyFire.splice(i,1);
            }
        }
    }

    function updateEnemyFireDefense(){
        /*
        check if any curve hit enemy fire
        */
        for(var i=0;i<curves.length;i++){
            var curve=curves[i];
            for(var j=enemyFire.length-1;j>=0;j--){
                var ef=enemyFire[j];
                if(Math.hypot(curve.x2 - ef.x, curve.y2 - ef.y) <= ef.size*3 && curve.progress == 1.0){
                    exp.createBasicExplosion(ef.x,ef.y,"brown",90);
                    enemyFire.splice(j,1);
                }
            }
        }
    }
    
    function drawEnemyFire(){
        for(var i=enemyFire.length-1;i>=0;i--){
            var ef=enemyFire[i];
            ctx.font=ef.size+"px Times New Roman";
            ctx.fillText(ef.icon,ef.x,ef.y);
        }
    }
    function drawTargets(){
        for(var i=0;i<targets.length;i++){
            var tar = targets[i];
            ctx.font = tar.size+"px Times New Roman";
            ctx.fillStyle = 'red';
            ctx.fillText(tar.icon, tar.x-tar.size*0.5, tar.y+tar.size*0.5);
        }     
    }

    function updateGame(){
    /*
    check each curve if hit a target
    */
        var hitsScore = 0;
        var hits = 0;
        var combo = {};
        var checkMissed = true;
        for(var i=curves.length-1;i>=0;i--){
            var curve = curves[i];
            for(var j=targets.length-1;j>=0;j--){
                var tar = targets[j];  
                /*
                var ctx=canvas.getContext("2d");
                ctx.beginPath();
                ctx.arc(tar.x,tar.y,tar.size,0,2*Math.PI);
                ctx.stroke();
                ctx.closePath();
                */
                if (Math.hypot(curve.x2 - tar.x, curve.y2 - tar.y) <= gameSettings.ENEMY_SIZE && curve.progress == 1.0) {
                    // hit detected
                    combo.x = tar.x;
                    combo.y = tar.y;
                    hits++;
                    hitsScore+=tar.dx+tar.dy;
                    exp.createExplosion(tar.x,tar.y,"orange");
                    exp.createExplosion(tar.x,tar.y,"yellow");
                    exp.createExplosion(tar.x,tar.y,"red");
                    exp.createExplosion(tar.x,tar.y,"grey");
                    targets.splice(j, 1);
                    checkMissed=false;
                }
            }
        }

        if(hits){
            /* 
            hit occured in the present
            check, update score info
            */
            score.hits+=hits;
            score.streak+=hits;
            if(score.streak%10==0&&!score.addTarget){
                /*
                streak of exactly 10 hits->
                increase enemy capacity
                */
                score.addTarget=true;
            }
            score.score+=Math.pow(hitsScore,hits)*score.streak*gameSettings.DIFFICULTY;
            if(hits>1){
                /*
                combo hit->add message
                */
                score.health+=hits;
                messages.push({
                    x:combo.x,
                    y:combo.y,
                    text:hits+"X Combo!!!",
                    color:"red",
                    font:"Times New Roman",
                    size:20,
                    ttl:5*1000*33
                });
                messages.push({
                    x:combo.x,
                    y:combo.y-25,
                    text:"+"+hits+"% HP!!!",
                    color:"green",
                    font:"Times New Roman",
                    size:20,
                    ttl:5*1000*33
                });
            }
        }
        if(checkMissed && curves.length && curves[0].progress==1.0){
            /*
            missed, streak is broken
            */
            score.streak=0; 
        }
    }

    function draw(){
       /*
       main drawing loop
       clear canvas, calls all methods
       in turn to draw/update game state
       */ ctx.clearRect(0,0,canvas.width,canvas.height);
        drawCurves();
        drawlaseremoji();
        exp.update(33);
        drawMessages();

        drawTargets();
        updateTargets();
        updateEnemyFireDefense();
        updateEnemyFire();
        updateGame();
        drawEnemyFire();
        updateCurves();

        if(targets.length < gameSettings.ACTIVE_TARGETS){
            targets.push(spawnTarget());
            score.spawned++;
        }
        drawScore();
        if(score.health<=0){
            if(!gameSettings.GAME_OVER){
              // alert("Game Over Dude, Your Total Score is : " +score.score +" Start New Game");
                vg();
              $('.hover_bkgr_fricc').show();
                gameSettings.GAME_OVER = true;
            }
             exp.createExplosion(randVal(canvas.width*0.3,canvas.width*0.7),randVal(canvas.height-60,canvas.height),randColor());
        }
        
        if(score.streak%10==0&&score.addTarget&&gameSettings.ACTIVE_TARGETS<gameSettings.TARGET_LIMIT){
            gameSettings.ACTIVE_TARGETS = Math.min(gameSettings.TARGET_LIMIT,gameSettings.ACTIVE_TARGETS+1);
            score.addTarget=false;
            messages.push({
                x:canvas.width*0.2,
                y:canvas.height/2,
                text:"Enemies Increased!",
                color:"red",
                font:"Times New Roman",
                size:30,
                ttl:5*1000*33
            });
        }
        drawInterval = requestAnimationFrame(draw);
        
    }
    
    //newGame();
    drawInterval = requestAnimationFrame(draw);
    // drawInterval = setInterval(draw, 33);
    
    var anims = ["right","left","bottom","top","rotate  ","opacity","scale","zoom","scaley","scalex","rotatey","rotateyr","rotatex","rotatexr"];
    confirmBox();
    
    function confirmBox(){
        // pause game if not already paused
        if(drawInterval){
            pause();
        }
        // call pause again to resume game after either button is clicked or X to close tbe dialog
        $.confirm({
            animation: anims[randVal(0,anims.length-1)],
            closeAnimation: anims[randVal(0,anims.length-1)],
            title: 'Start New Game',
            content: 'Set Difficulty: '+'<select class="btn-primary" id="selectDifficulty">'+
                '<option value=1 '+(selectDiff.value==='1'? 'selected':'')+'>Easy</option>'+
                '<option value=2 ' +(selectDiff.value==='2'? 'selected':'')+'>Normal</option>'+
                '<option value=3 ' +(selectDiff.value==='3'? 'selected':'')+'>Hard</option>'+
                '<option value=4 '+(selectDiff.value==='4'? 'selected':'')+'>eXtreme</option>'+
                '<option value=5 '+(selectDiff.value==='5'? 'selected':'')+'>Aag!</option></select>',
            type:'blue',
            closeIcon: function(){
                pause();
            },
            buttons: {
                "¿": function (){
                    randomCanvasColor();
                    pause();
                    //confirmBox();
                },
                cancel: function () {
                    //$.alert('Canceled!');
                    pause();
                },
                "Start Game": function () {
                    var diffVal = this.$content.find('#selectDifficulty').val();
                    selectDiff.value = diffVal;
                    newGame();
                    pause();
                }
            }
        });
    }
};

// Math.hypot polyfill
Math.hypot = Math.hypot || function() {
  var y = 0;
  var length = arguments.length;

  for (var i = 0; i < length; i++) {
    if (arguments[i] === Infinity || arguments[i] === -Infinity) {
      return Infinity;
    }
    y += arguments[i] * arguments[i];
  }
  return Math.sqrt(y);
};


if (!window.requestAnimationFrame) (function() {
    'use strict';
    function requestAnimationFrame(callback) {
        var
        currentTime = now(),
        delay = Math.max(0, 16 - (currentTime - lastTime));

        lastTime = currentTime;
        return setTimeout(function () {
            lastTime = now();
            callback(lastTime - startTime);
        }, delay);
    }
    function cancelAnimationFrame(id) {
        clearTimeout(id);
    }
    var
    raf = 'RequestAnimationFrame',
    caf = 'CancelAnimationFrame',
    webkit = 'webkit',
    moz = 'moz',
    now = Date.now || function () {
        return new Date().getTime();
    },
    startTime = now(),
    lastTime = startTime;
    window.requestAnimationFrame = window[moz + raf] || window[webkit + raf] || requestAnimationFrame;
    window.cancelAnimationFrame = window[moz + caf] || window[webkit + caf] || window[webkit + 'CancelRequestAnimationFrame'] || cancelAnimationFrame;
})();

if (!Array.prototype.findIndex) { Object.defineProperty(Array.prototype, 'findIndex', { value: function(predicate) { 'use strict'; if (this == null) { throw new TypeError('Array.prototype.findIndex called on null or undefined'); } if (typeof predicate !== 'function') { throw new TypeError('predicate must be a function'); } var list = Object(this); var length = list.length >>> 0; var thisArg = arguments[1]; var value; for (var i = 0; i < length; i++) { value = list[i]; if (predicate.call(thisArg, value, i, list)) { return i; } } return -1; }, enumerable: false, configurable: false, writable: false });}

if(!Array.prototype.indexOf){Array.prototype.indexOf=function(b){var a=this.length>>>0;var c=Number(arguments[1])||0;c=(c<0)?Math.ceil(c):Math.floor(c);if(c<0){c+=a}for(;c<a;c++){if(c in this&&this[c]===b){return c}}return -1}};


window.onload = ShootOutEmoji;