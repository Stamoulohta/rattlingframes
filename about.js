window.addEventListener("DOMContentLoaded", ()=>{
    const icon = document.querySelector("i.fa-play");
    const audio = document.querySelector("audio");
    audio.addEventListener("ended", ()=>{
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
    })
    icon.addEventListener("click",()=>{
        if ( audio.paused ){
            audio.play();
        } else {
            audio.pause();
        }
        icon.classList.toggle("fa-play");
        icon.classList.toggle("fa-pause");
    });
})
