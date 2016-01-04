/**
 * Created by S on 27/12/2015.
 */
var ctx, color = "#000";
var globalsrc = '/socialnet/public/canvasimg/'
var tempImg,tmpO;
var tmpW;
var canvas_id=33;
var invert = false;
var time = 60000
$(function(){

    newCanvas();

    paintMedias()

    setTimeout(function(){
        var c = $("canvas")
        var w = c.width()
        var h = c.height()
        console.log("COME ON")

    },3000)


    Pusher.log = function(msg) {
        console.log(msg);
    };
    var pusher = new Pusher("650badadf8611ff0c889")
    var channel = pusher.subscribe("33");
    channel.bind('App\\Events\\ChEvent',
        function(data) {
            var media = [{"value":data.texto}]
            if(media[0].value.type=="img"){
                media[0].value.x=parseInt(media[0].value.x)
                media[0].value.y=parseInt(media[0].value.y)
                media[0].value.angle=parseFloat(media[0].value.angle)
            }
            setMedia(media,0)

        }
    );

    var target = document.getElementById("page");
    target.addEventListener("dragover", function(e){e.preventDefault();}, true);
    target.addEventListener("drop", function(e){
        e.preventDefault();
        loadImage(e.dataTransfer.files[0]);
    }, true);


    $(document).on("click", "#save", function(){
        resize_save($("#image"))
    });

    var timer = setInterval(tryPreview, time);

    function resetInterval(){
        clearInterval(timer);
        timer = setInterval(tryPreview, time);
    }
})

function tryPreview(){

        $.ajax({
            type: "get",
            url: "lastmod",
            canvas_id: canvas_id,
            success: function(data) {
                console.log("SUCCESS: "+data);
            },
            error: function(status) {
                console.log("ERROR: "+status);
            }
        }).done(function(data){

            if(data==true){
                var canvas = document.getElementById("canvas");
                var img64 = canvas.toDataURL("image/png");
                $.ajax({
                    type: "POST",
                    url: "uploadCanvas",
                    //contentType: "application/x-www-form-urlencoded",
                    data: {
                        img64: img64
                    },
                    success: function (response) {
                        console.log(response);
                    },
                    error: function (errorThrown) {
                        console.log(errorThrown)
                    }
                })
            }
        })

}



function resize(width,height){
    return $.ajax({
        type: "POST",
        url: "resize",
        data: {
            width: width,
            height: height,
            src: tmpO
        },
        success: function(data) {
            //console.log("SUCCESS: "+data);
            tmpO = data

        },
        error: function(status) {
            console.log("ERROR: "+status);
        }
    })
}

function resize_save(div){
    var o = $('#image').freetrans('getOptions')
    if(o.scalex!=1||o.scaley!=1){
        var w = div.width()*o.scalex
        var h = div.height()*o.scaley
        $.when(resize(w,h)).done(function(o){
            saveImgCanvas(div)
        })
    }
    else{
        saveImgCanvas(div)
    }
}

function saveImgCanvas(div){
    var date = Math.round(new Date().getTime()/1000)
    var o = div.freetrans('getOptions')
    var angle = o.angle;
    var x= o.x
    var y= o.y-44

    if(o.scalex!=1||o.scaley!=1){
        var o = $('#image').freetrans('getBounds')
        var h = (o.height/2)
        var w = (o.width/2)
        x = Math.abs(w-o.center.x)
        y = Math.abs(h-o.center.y)-44
    }

    console.log("X:"+x+", "+"Y:"+y)



    var doc = {"canvas_id": canvas_id,"created_at":date, "type": "img","src":tmpO,"x": x, "y": y,"angle":angle}
    $.ajax({
        type: "POST",
        url: "push",
        data: {
            doc: doc
        }
    }).done(function(o){
        div.freetrans('destroy');
        div.css('background-image','')
        div.css('top','0')
        div.css('left','0')
        div.css('width','0')
        div.css('height','0')
        saveDoc(doc);
    })
}


function setMedia(rows,i){

        var m = rows[i].value

        console.log(m)
        if (m.type == "stroke") {
            setStroke(m)
            if(i+1<rows.length)
                setMedia(rows,i+1)
        }
        else if (m.type == "img") {
            var base_image = new Image();
            base_image.src = "/socialnet/public/canvasimg/" + m.src
            base_image.onload = function () {
                if(m.angle!=0){
                    setImg(base_image, m.x, m.y, m.angle)
                    console.log("drawing on: x:"+ m.x+", y:"+m.y+", angle:"+ m.angle)
                }
                else
                    ctx.drawImage(base_image, m.x, m.y);
                if(i+1<rows.length)
                    setMedia(rows,i+1)

            }
        }
}



function setStroke(media){
    var xs = media.x
    var ys = media.y
    ctx.beginPath();
    ctx.strokeStyle = media.color;
    for (var i = 0; i < xs.length; i++) {
        ctx.lineTo(xs[i], ys[i]);
        ctx.stroke();
    }
    ctx.strokeStyle = color
}

function setImg(image,x,y,angle)
{
    var TO_RADIANS = Math.PI/180;
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.translate(x+(image.width / 2), y+(image.height / 2));
    ctx.rotate(TO_RADIANS*angle);
    ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
    ctx.setTransform(1, 0, 0, 1, 0, 0)
}




function saveDoc(doc){
    var db = $.couch.db("media");
    db.saveDoc(doc, {
        success: function (response, textStatus, jqXHR) {
            console.log(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    })
}

function loadImage(src){
    //	Prevent any non-image file type from being read.
    if(!src.type.match(/image.*/)){
        console.log("The dropped file is not an image: ", src.type);
        return;
    }

    //	Create our FileReader and run the results through the render function.
    var reader = new FileReader();
    reader.onload = function(e){
        var data = e.target.result
        $.ajax({
            type: "POST",
            url: "uploadCanvas",
            //contentType: "application/x-www-form-urlencoded",
            data: {
                img64: data
            },
            success: function (response) {
                console.log(response);
            },
            error: function (errorThrown) {
                console.log(errorThrown)
            }

        }).done(function(o) {
            tempImg = globalsrc + o
            tmpO = o
            var tmp = new Image();
            tmp.src = tempImg
            tmp.onload = function(){
                $("#image").css('width',tmp.width)
                $("#image").css('height',tmp.height)

                $("#image").css({'background': 'url('+tempImg+') no-repeat',
                    'background-size': '100% auto'})



                $("#image").freetrans({
                    'rot-origin': '50% 50%'
                }).css({
                    border: "1px solid pink"
                });
                var o = $('#image').freetrans('getBounds');
                tmpW = o.width
                tmp=null
            }



        });

    };
    reader.readAsDataURL(src);
}


function paintMedias(){
    $.couch.urlPrefix = "https://socpa.cloudant.com";
    $.couch.login({
        name: "socpa",
        password: "asdargonnijao",
        success: function(data) {
            console.log(data);

        },
        error: function(status) {
            console.log(status);
        }
    });

    $.couch.db("media").view("media/media", {
        startkey: [canvas_id],
        endkey: [canvas_id,{}],
        reduce: false,
        success: function(data) {
            setMedia(data.rows,0)
        },
        error: function(status) {
            console.log(status);
        }

    });
}




//********INITIALIZE CANVAS********/
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

//***PAINT METHODS***/

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
    //ctx.lineWidth = 15;
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
    var xs = [];
    var ys = [];
    var i = 0;
    var clicked = 0;
    var start = function(e) {
        console.log("START MOUSE")
        clicked = 1;
        ctx.beginPath();
        x = e.pageX;
        y = e.pageY-44;
        ctx.moveTo(x,y);
        xs[i]=x;
        ys[i++]=y;
    };
    var move = function(e) {
        console.log("MOVIENDO MOUSE")
        if(clicked==1){
            x = e.pageX;
            y = e.pageY-44;
            ctx.lineTo(x,y);
            ctx.stroke();
            xs[i]=x;
            ys[i++]=y;
        }
    };
    var stop = function(e) {
        console.log("STOP MOUSE")
        i=0;
        if(clicked==1) {
            var date = Math.round(new Date().getTime()/1000)
            var doc = {"canvas_id": canvas_id,"created_at":date, "type": "stroke", "color": color, "x": xs, "y": ys}
            saveDoc(doc);
            xs = [];
            ys = [];
            clicked = 0;

            $.ajax({
                type: "POST",
                url: "push",
                data: {
                    doc: doc
                }
            })

        }

    };
    document.getElementById("canvas").addEventListener("mousedown", start, false);
    document.getElementById("canvas").addEventListener("mousemove", move, false);
    document.addEventListener("mouseup", stop, false);
};








