const test=require('node:test'),assert=require('node:assert/strict');
require('../flight.js');
const ship=()=>({x:400,y:400,a:0,speed:0,dash:0,dashAngle:0});
const simulate=(s,intent,n=60,dt=1/60)=>{for(let i=0;i<n;i++)Flight.step(s,intent,dt);return s;};
test('distant pointer accelerates more than near pointer, with a speed cap',()=>{
 const near=simulate(ship(),{x:470,y:400,active:true},15),far=simulate(ship(),{x:900,y:400,active:true},15);
 assert(far.speed>near.speed);assert(far.speed<=Flight.maxSpeed);
});
test('arrival settles inside the parking zone without overshoot or circling',()=>{
 const s=simulate(ship(),{x:700,y:400,active:true},600);
 assert(s.x<=676.001);assert(Math.abs(s.y-400)<.001);assert(s.speed<.1);
});
test('opposite pointer turns over time, then travels toward it',()=>{
 const s=ship();Flight.step(s,{x:100,y:400,active:true},1/60);
 assert(Math.abs(s.a)<.14);assert(s.x===400);
 simulate(s,{x:100,y:400,active:true},240);assert(s.x<200);
});
test('stationary ship can aim inside parking zone',()=>{
 const s=simulate(ship(),{x:400,y:380,active:true});
 assert(s.x===400&&s.y===400);assert(Math.abs(s.a+Math.PI/2)<.001);
});
test('stationary dash follows captured heading rather than new pointer',()=>{
 const s=ship();s.dash=.2;s.dashAngle=Math.PI/2;
 Flight.step(s,{x:900,y:400,active:true},.02);assert(Math.abs(s.x-400)<.001);assert(s.y>418);
});
test('60 and 120 Hz produce similar motion',()=>{
 const intent={x:1000,y:400,active:true};
 const a=simulate(ship(),intent,60,1/60),b=simulate(ship(),intent,120,1/120);
 assert(Math.abs(a.x-b.x)<3);
});
