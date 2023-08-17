let input = document.getElementsByClassName("fillup");
let red = document.getElementsByClassName("red");
let green = document.getElementsByClassName("green");

input[0].onchange = function(){
    red[0].style.display = "none";
    green[0].style.display = "block";
}
input[1].onchange = function(){
    red[1].style.display = "none";
    green[1].style.display = "block";
}
input[2].onchange = function(){
    red[2].style.display = "none";
    green[2].style.display = "block"
}
     
let  form1 = document.querySelector("#form1");
form1.addEventListener("submit",function(event){
let fillup = true;
    for(let i=0;i<3;i++){
        if(green[i].style.display === ""){
            fillup = false;
            break;
        }
    }
    if(!fillup){
        event.preventDefault();
        window.alert("Please make sure you have filled all the blocks");
    }
});

input[3].onchange = function(){
    red[3].style.display = "none";
    green[3].style.display = "block";
}
input[4].onchange = function(){
    red[4].style.display = "none";
    green[4].style.display = "block";
}
let  form2 = document.querySelector("#form2");
form2.addEventListener("submit",function(event){
    let fillup = true;
    for(let i=3;i<5;i++){
        if(green[i].style.display === ""){
            fillup = false;
            break;
        }
    }
    if(!fillup){
        event.preventDefault();
        window.alert("Please make sure you have filled all the blocks");
    }
});