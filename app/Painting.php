<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Comment;

class Painting extends Model
{

    public function comments(){
        return Comment::where('painting',$this->idPainting)->get();
   }

    public function likesPaintings(){
        return $this->hasMany('App\Likes_painting');
    }

    static public function viewMyPainting($idUser){
        return Painting::where('publish','=',$idUser)->get();

    }

    static public function viewPaintingFriend($friendIds){//Son los ids de mis amigos
        $hoy=date("Y-m-d H:i:s");
        $ayer=date('Y-m-d H:i:s', strtotime('-5 day')) ;
        return Painting::whereIn('publish', $friendIds)->whereBetween('created_at', array($ayer,$hoy))->get();

    }

}
