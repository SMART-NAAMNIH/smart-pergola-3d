(function(){
 var B="https://smart-naamnih.github.io/smart-pergola-3d/assets/carport/";var root=document.getElementById('spc');if(!root)return;
 var lang=(document.documentElement.lang||'he').slice(0,2);
 var blocks=root.querySelectorAll('.spl');var vis=root.querySelector('.spl[data-l="'+lang+'"]')||root.querySelector('.spl[data-l="he"]');
 if(vis)vis.classList.add('on');
 var end=new Date('2026-12-01T23:59:00+02:00').getTime();
 root.querySelectorAll('[data-cd]').forEach(function(cd){var t=function(){var l=Math.max(0,end-Date.now());var d=Math.floor(l/864e5);l-=d*864e5;var h=Math.floor(l/36e5);l-=h*36e5;cd.querySelector('[data-d]').textContent=d;cd.querySelector('[data-h]').textContent=h;cd.querySelector('[data-m]').textContent=Math.floor(l/6e4);};t();setInterval(t,30000);});
 var box=vis&&vis.querySelector('.spin');if(!box)return;
 var img=box.querySelector('img');var u=6,v=0,auto=true,drag=null,loaded=false;
 function show(){img.src=B+'spin/s'+v+'_'+u+'.jpg';}
 function preload(){if(loaded)return;loaded=true;for(var a=0;a<3;a++)for(var b=0;b<11;b++){var i=new Image();i.src=B+'spin/s'+a+'_'+b+'.jpg';}}
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){preload();io.disconnect();}},{rootMargin:'300px'});io.observe(box);}else preload();
 setInterval(function(){if(auto&&loaded){u=(u+1)%11;show();}},900);
 box.addEventListener('pointerdown',function(e){if(e.target.closest('button'))return;auto=false;drag={x:e.clientX,y:e.clientY,u:u,v:v};});
 window.addEventListener('pointermove',function(e){if(!drag)return;var nu=((drag.u+Math.round((drag.x-e.clientX)/35))%11+11)%11;var nv=Math.max(0,Math.min(2,drag.v+Math.round((e.clientY-drag.y)/70)));if(nu!==u||nv!==v){u=nu;v=nv;show();}});
 window.addEventListener('pointerup',function(){drag=null;});
 box.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){auto=false;var a=btn.getAttribute('data-a');if(a==='l')u=(u+10)%11;if(a==='r')u=(u+1)%11;if(a==='t')v=(v+1)%3;show();});});
})();
