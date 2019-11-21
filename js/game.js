//Поиск и указание режима
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
//Файлы изображений
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeUp = new Image();
var pipeBottom = new Image();
bird.src = "../img/bird.png";
bg.src = "../img/bg.png";
fg.src = "../img/fg.png";
pipeUp.src = "../img/pipeUp.png";
pipeBottom.src = "../img/pipeBottom.png";
// Звуковые файлы
var fly = new Audio();
var score_audio = new Audio();
fly.src = "../audio/fly.mp3";
score_audio.src = "../audio/score.mp3";
//Отступ между трубами
var gap = 120;
//Обработка нажатия клавиш
document.addEventListener('keypress', upDown);
function upDown(EO){
  EO = EO||window.event;
  var key = EO.keyCode||EO.which;
  //console.log(key);
  if (key === 1094){// ц
      moveUp();
  }
  if (key === 1099){// ы
    moveDown();
  }
  if (key === 1062){// Ц
    moveUpTwice();       // х2 для быстрого взлёта
  }
}
//Обработка при касании тача
document.addEventListener("touchstart", moveUp);
//Обработка свайпов
var initialPoint;
var finalPoint;
document.addEventListener('touchstart', start, false);
function start(EO){
    EO=EO||window.event;
    initialPoint=EO.changedTouches[0];
};
document.addEventListener('touchend', end, false);
function end(EO){
    finalPoint=EO.changedTouches[0];
    var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
    var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
    if (xAbs > 20 || yAbs > 20) if (xAbs > yAbs) {
        if (finalPoint.pageX < initialPoint.pageX){
                //console.log("Left");
            }
            else{
                //console.log("Rigth");
            }
        }
        else {
            if (finalPoint.pageY < initialPoint.pageY){
                //console.log("Up");
                moveUpTwice();
            }
            else{
                moveDown();
            }
        }
}
//Функция взлета птички
function moveUp(){
 yPos -= 30;
 grav = 1.5;
 fly.play();
}
function moveUpTwice(){
  yPos -= 60;
  grav = 1.5;
  fly.play();
}
//Функция падения птички
function moveDown(){
  grav = 3;
}
// Создание блоков
var pipe = [];
pipe[0] = {
 x : cvs.width,
 y : 0
}
//Переменная для подсчёта очков
var score = 0;
// Стартовая позиция птицы + переменная для изменения гравитации
var xPos = 10;
var yPos = 150;
var grav = 1.5;
//Функция рисования
function draw() {
 ctx.drawImage(bg, 0, 0);
  for(var i = 0; i < pipe.length; i++) {
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
    pipe[i].x--;
    if(pipe[i].x == 125) { //Расстояние создания нового блока по X
    //Рандомное создание новых блоков
      pipe.push({ 
        x : cvs.width,
        y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
      });
    }
    // Отслеживание прикосновений
    if(xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width
    && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= 
    pipe[i].y + pipeUp.height + gap)
    || yPos + bird.height >= cvs.height - fg.height){
      location.href = "../html/gameOver.html";
    }
    //При прохождении очередной трубы +1 к счётчику и звук
    if(pipe[i].x == 5) {
      score++;
      score_audio.play();
    }
  }
  //Отрисовка прички и земли 
  ctx.drawImage(fg, 0, cvs.height - fg.height);
  ctx.drawImage(bird, xPos, yPos);
  //Эффект гравитации
  yPos += grav;
  //Добавление счетчика очков
  ctx.fillStyle = "#000";
  ctx.font = "24px Verdana";
  ctx.fillText("Счет: " + score, 10, cvs.height - 20);
  //
  requestAnimationFrame(draw);
}
//Функция перехода на экран окончания игры
function gameOverMenu(){
   if (!gameOver){
   document.getElementsById("game_over").style.cssText = 'display: flex;';
  }
}
//Выполнить функцию отрисовки после загрузки последнего изображения
pipeBottom.onload = draw;

