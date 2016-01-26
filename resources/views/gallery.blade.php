<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
    <link href="{{asset('style/editProfile.css')}}" rel="stylesheet" type="text/css">
    <script src="generalJs/menu.js"></script>
    <script src="{{asset('generalJs/chatIndividual.js')}}"></script>
    <link href="{{asset('style/chatIndividual.css')}}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="style/menu.css">
    <script type="text/javascript" src="{{asset('generalJs/buscador.js')}}"></script>
    <script src="http://js.pusher.com/3.0/pusher.min.js"></script>
</head>
<body>
<header>
    <!-- hamburger menu: http://codepen.io/g13nn/pen/eHGEF -->
    <button class="hamburger">&#9776;</button>
    <button class="cross">&#735;</button>
    Gallery
    <button class="friends"><img src="style/profile_icon_small.png"></button><!--generalImg/ -->
    <button class="cross2">&#735;</button>
</header>
<div class="menu" id = "menu1">
    <ul>
        <li><a href="gallery">Gallery</a></li>
        <li><a href="atelier">Atelier</a></li>
        <li><a href="home">Museum</a></li>
        <li><a href="myProfile">My Profile</a></li>
        <li><a href="search">My friends</a></li>
    </ul>
</div>
<div class="menu" id = "menu2">

    <ul id ="friends_ul">>

    </ul>
</div>
<div id="contenido">
    <div>
        <label>Resultado de la búsqueda:</label><br>
        @if (count($painting)>0)
            @foreach ($painting as $p)
                <figure>
                    <a href="canvas/{{ $p->idPainting}}"><img src="{{asset('preview/'.$p->image)}}" /></a>
                    <figcaption>{{$p->title}}.</figcaption>
                </figure>
            @endforeach
        @else

            <p>No tienes aún painting.</p>
        @endif
    </div>
</div>
<!-- Slidebars -->
<div id = "chats-container"></div>
<input type="hidden" id="idUser" value="{{$idUserSession}}"/>
</body>
</html>