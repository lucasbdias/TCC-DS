<?php

function enviarImagem($file) {
    $formatoArquivo = explode('.', $file['name']);
    $imagemNome     = uniqid() . '.' . $formatoArquivo[count($formatoArquivo) - 1];
    if (move_uploaded_file($file['tmp_name'],  'imagens/' . $imagemNome)) {
        return $imagemNome;
    } else {
        return false;
    }
}

function validarImagem($imagem) {     
    if ($imagem['type'] == 'image/jpeg' ||
        $imagem['type'] == 'image/jpg' ||
        $imagem['type'] == 'image/png') {        
        $tamanho = ($imagem['size'] / 1024) / 1024;        
        if ($tamanho < 5) {
            return true;
        } 
    }    
    return false;
}

function resize($file, $w, $h, $crop=FALSE) {
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width-($width*abs($r-$w/$h)));
        } else {
            $height = ceil($height-($height*abs($r-$w/$h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w/$h > $r) {
            $newwidth = $h*$r;
            $newheight = $h;
        } else {
            $newheight = $w/$r;
            $newwidth = $w;
        }
    }
    $src = imagecreatefromjpeg($file);
    $dst = imagecreatetruecolor($newwidth, $newheight);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    return $dst;
    }
?>