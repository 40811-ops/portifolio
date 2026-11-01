(function(){
'use strict';
var d=document,root=d.documentElement,$=function(s){return d.querySelector(s)};
var reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');
/* 1. Preloader: progresso real (load), sem espera artificial, com limite de 4s */
var pre=$('#preloader'),fill=$('#pre-fill'),pct=$('#pre-pct'),fim=false;
function prog(n){fill.style.width=n+'%';pct.textContent=n+'%'}
function sair(){if(fim)return;fim=true;prog(100);setTimeout(function(){pre.classList.add('sai');root.classList.add('pronto');revelar();setTimeout(function(){pre.remove()},1000)},250)}
prog(30);
d.fonts&&d.fonts.ready.then(function(){prog(70)});
addEventListener('load',sair);
setTimeout(sair,4000);
if(d.readyState==='complete')sair();
/* 2. Tema */
$('#tema').addEventListener('click',function(){
  var t=root.dataset.tema==='dark'?'light':'dark';root.dataset.tema=t;
  try{localStorage.setItem('tema',t)}catch(e){}
});
/* 3. Menu mobile + seção atual */
var menu=$('#menu'),mb=$('#menu-btn');
mb.addEventListener('click',function(){var a=menu.classList.toggle('aberto');mb.setAttribute('aria-expanded',a)});
menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.classList.remove('aberto');mb.setAttribute('aria-expanded',false)}});
d.addEventListener('keydown',function(e){if(e.key==='Escape')menu.classList.remove('aberto')});
var links=[].slice.call(d.querySelectorAll('nav a'));
var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)links.forEach(function(a){a.classList.toggle('ativo',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
d.querySelectorAll('main section').forEach(function(s){spy.observe(s)});
/* 4. Revelação ao rolar */
function revelar(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}})},{threshold:.15});
  d.querySelectorAll('.rev').forEach(function(el,i){
    if(el.parentElement.classList.contains('gigante')||el.parentElement.classList.contains('hero-base'))el.style.setProperty('--i',[].indexOf.call(el.parentElement.children,el)+1);
    io.observe(el)});
}
/* 5. Barra de progresso */
var barra=$('#progresso'),tick=false;
function atualizar(){var h=root.scrollHeight-innerHeight;barra.style.transform='scaleX('+(h>0?scrollY/h:0)+')';tick=false}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(atualizar)}},{passive:true});
/* 6. Galeria: setas, teclado e arraste */
var g=$('#galeria');
function passo(dir){var c=g.querySelector('.card');g.scrollBy({left:dir*(c.offsetWidth+24),behavior:reduz?'auto':'smooth'})}
$('#ant').addEventListener('click',function(){passo(-1)});
$('#prox').addEventListener('click',function(){passo(1)});
g.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();passo(1)}if(e.key==='ArrowLeft'){e.preventDefault();passo(-1)}});
var x0,s0,arr=false;
g.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;arr=true;x0=e.clientX;s0=g.scrollLeft;g.classList.add('arrasta')});
addEventListener('pointermove',function(e){if(arr)g.scrollLeft=s0-(e.clientX-x0)});
addEventListener('pointerup',function(){if(arr){arr=false;g.classList.remove('arrasta')}});
g.addEventListener('dragstart',function(e){e.preventDefault()});
/* 7. Cursor (só com mouse e sem redução de movimento) */
var cur=$('#cursor');
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduz){
  var cx=0,cy=0,tx=0,ty=0;
  addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;cur.classList.add('on')});
  d.addEventListener('mouseleave',function(){cur.classList.remove('on')});
  (function loop(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(loop)})();
  d.addEventListener('mouseover',function(e){cur.classList.toggle('grande',!!e.target.closest('a,button,.card,input,textarea'))});
}
/* 8. Copiar e-mail */
var aviso=$('#aviso');
$('#copiar').addEventListener('click',function(){
  var mail='gabrieldeocustodio@gmail.com';
  function ok(m){aviso.textContent=m;setTimeout(function(){aviso.textContent=''},2500)}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(mail).then(function(){ok('Copiado!')},function(){ok('Não foi possível copiar')});
  else ok('Copie manualmente: '+mail);
});
/* 9. Formulário: validação, sem simular envio (abre o app de e-mail) */
var f=$('#form');
function erro(id,m){f.querySelector('[data-for='+id+']').textContent=m;$('#'+id).setAttribute('aria-invalid',!!m)}
f.addEventListener('submit',function(e){
  e.preventDefault();
  var n=$('#f-nome').value.trim(),m=$('#f-email').value.trim(),t=$('#f-msg').value.trim(),v=true;
  erro('f-nome',n.length<2?(v=false,'Informe seu nome.'):'');
  erro('f-email',/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)?'':(v=false,'Informe um e-mail válido.'));
  erro('f-msg',t.length<10?(v=false,'Escreva ao menos 10 caracteres.'):'');
  if(v)location.href='mailto:gabrieldeocustodio@gmail.com?subject='+encodeURIComponent('Contato pelo portfólio — '+n)+'&body='+encodeURIComponent(t+'\n\n'+n+' ('+m+')');
});
/* 10. Rodapé */
$('#ano').textContent=new Date().getFullYear();
})();