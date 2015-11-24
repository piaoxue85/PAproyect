<!doctype html>
<html>
<head>
    <title>Sketch Pad</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
    <style type="text/css">
        body {
            margin:0px;
            width:100%;
            height:100%;
            overflow:hidden;
            font-family:Arial;
            /* prevent text selection on ui */
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            /* prevent scrolling in windows phone */
            -ms-touch-action: none;
            /* prevent selection highlight */
            -webkit-tap-highlight-color: rgba(0,0,0,0);
        }

        .header, .footer{
            position: absolute;
            background-color: #222;
            text-align: center;
        }
        .header {
            top: 0px;
            left: 0px;
            right: 0px;
            height: 32px;
            padding:6px;
        }
        .footer {
            bottom: 0px;
            left: 0px;
            right: 0px;
            height: 42px;
            padding:2px;
        }
        .title {
            width: auto;
            line-height: 32px;
            font-size: 20px;
            font-weight: bold;
            color: #eee;
            text-shadow: 0px -1px #000;
            padding:0 60px;
        }
        .navbtn {
            cursor: pointer;
            float:left;
            padding: 6px 10px;
            font-weight: bold;
            line-height: 18px;
            font-size: 14px;
            color: #eee;
            text-shadow: 0px -1px #000;
            border: solid 1px #111;
            border-radius: 4px;
            background-color: #404040;
            box-shadow: 0 0 1px 1px #555,inset 0 1px 0 0 #666;
        }
        .navbtn-hover, .navbtn:active {
            color: #222;
            text-shadow: 0px 1px #aaa;
            background-color: #aaa;
            box-shadow: 0 0 1px 1px #444,inset 0 1px 0 0 #ccc;
        }
        #content{
            position: absolute;
            top: 44px;
            left: 0px;
            right: 0px;
            bottom: 46px;
            overflow:hidden;
            background-color:#ddd;
        }
        #canvas{
            cursor:crosshair ;
            background-color:#fff;
        }
        .palette-case {
            width:260px;
            margin:auto;
            text-align:center;
        }
        .palette-box {
            float:left;
            padding:2px 6px 2px 6px;
        }
        .palette {
            border:2px solid #777;
            height:36px;
            width:36px;
        }
        .red{
            background-color:#c22;
        }
        .blue{
            background-color:#22c;
        }
        .green{
            background-color:#2c2;
        }
        .white{
            background-color:#fff;
        }
        .black{
            background-color:#000;
            border:2px dashed #fff;
        }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script type="text/javascript">

        var ctx, color = "#000";
        document.addEventListener( "DOMContentLoaded", function(){

            // setup a new canvas for drawing wait for device init
            setTimeout(function(){
                newCanvas();
            }, 1000);
        }, false );

        function saveCanvas(){
            var dataURL = document.getElementById("canvas").toDataURL();
            $.ajax({
                type: "POST",
                url: "uploadCanvas",
                //contentType: "application/x-www-form-urlencoded",
                data: {
                    img64: dataURL
                }
            }).done(function(o) {
                console.log(o);
               window.location.href=o;
            });
        }





        // function to setup a new canvas for drawing
        function newCanvas(){
            //define and resize canvas
            document.getElementById("content").style.height = window.innerHeight-90;
            var canvas = '<canvas id="canvas" width="'+window.innerWidth+'" height="'+(window.innerHeight-90)+'"></canvas>';
            document.getElementById("content").innerHTML = canvas;

            // setup canvas
            ctx=document.getElementById("canvas").getContext("2d");
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;

            // setup to trigger drawing on mouse or touch
            drawTouch();
            drawPointer();
            drawMouse();
        }

        function selectColor(el){
            for(var i=0;i<document.getElementsByClassName("palette").length;i++){
                document.getElementsByClassName("palette")[i].style.borderColor = "#777";
                document.getElementsByClassName("palette")[i].style.borderStyle = "solid";
            }
            el.style.borderColor = "#fff";
            el.style.borderStyle = "dashed";
            color = window.getComputedStyle(el).backgroundColor;
            ctx.beginPath();
            ctx.strokeStyle = color;
        }
        // prototype to	start drawing on touch using canvas moveTo and lineTo
        var drawTouch = function() {
            var start = function(e) {
                ctx.beginPath();
                x = e.changedTouches[0].pageX;
                y = e.changedTouches[0].pageY-44;
                ctx.moveTo(x,y);
            };
            var move = function(e) {
                e.preventDefault();
                x = e.changedTouches[0].pageX;
                y = e.changedTouches[0].pageY-44;
                ctx.lineTo(x,y);
                ctx.stroke();
            };
            document.getElementById("canvas").addEventListener("touchstart", start, false);
            document.getElementById("canvas").addEventListener("touchmove", move, false);
        };

        // prototype to	start drawing on pointer(microsoft ie) using canvas moveTo and lineTo
        var drawPointer = function() {
            var start = function(e) {
                e = e.originalEvent;
                ctx.beginPath();
                x = e.pageX;
                y = e.pageY-44;
                ctx.moveTo(x,y);
            };
            var move = function(e) {
                e.preventDefault();
                e = e.originalEvent;
                x = e.pageX;
                y = e.pageY-44;
                ctx.lineTo(x,y);
                ctx.stroke();
            };
            document.getElementById("canvas").addEventListener("MSPointerDown", start, false);
            document.getElementById("canvas").addEventListener("MSPointerMove", move, false);
        };
        // prototype to	start drawing on mouse using canvas moveTo and lineTo
        var drawMouse = function() {
            var clicked = 0;
            var start = function(e) {
                clicked = 1;
                ctx.beginPath();
                x = e.pageX;
                y = e.pageY-44;
                ctx.moveTo(x,y);
            };
            var move = function(e) {
                if(clicked){
                    x = e.pageX;
                    y = e.pageY-44;
                    ctx.lineTo(x,y);
                    ctx.stroke();
                }
            };
            var stop = function(e) {
                clicked = 0;
            };
            document.getElementById("canvas").addEventListener("mousedown", start, false);
            document.getElementById("canvas").addEventListener("mousemove", move, false);
            document.addEventListener("mouseup", stop, false);
        };
    </script>
</head>
<body>
<div id="page">
    <div class="header">
        <a id="new" class="navbtn" onclick="newCanvas()">New</a>
        <a id="save" class="navbtn" onclick="saveCanvas()">Save</a>
        <div class="title">Sketch Pad</div>
    </div>
    <div id="content"><p style="text-align:center">Loading Canvas...</p></div>
    <div class="footer">
        <div class="palette-case">
            <div class="palette-box">
                <div class="palette white" onclick="selectColor(this)"></div>
            </div>
            <div class="palette-box">
                <div class="palette red" onclick="selectColor(this)"></div>
            </div>
            <div class="palette-box">
                <div class="palette blue" onclick="selectColor(this)"></div>
            </div>
            <div class="palette-box">
                <div class="palette green" onclick="selectColor(this)"></div>
            </div>
            <div class="palette-box">
                <div class="palette black" onclick="selectColor(this)"></div>
            </div>
            <div style="clear:both"></div>
        </div>
    </div>
</div>
</body>
</html>