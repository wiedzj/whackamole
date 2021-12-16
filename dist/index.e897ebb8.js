const t={rows:4,columns:4,horizonHeight:30,maxMoles:3,lives:5,speedIncrease:{time:5e3,increase:1.03},amountOfMolesIncrease:{time:5e3,increase:1},sprites:{moleHill:"../assets/mole-hill.png",ground:"../assets/grass2.jpeg",mole_1:"../assets/mole1.png",mole_2:"../assets/poepie.png",mole_3:"../assets/kip.png"},moles:[{spriteId:1,color:"#E6A951",probability:20,time:1e3,crawlOutTime:500,hit:{type:"point",amount:1},miss:{type:"live",amount:-1}},{spriteId:2,color:"blue",probability:28,time:500,crawlOutTime:1e3,hit:{type:"live",amount:-1}},{spriteId:3,color:"yellow",probability:4,time:750,crawlOutTime:200,hit:{type:"live",amount:1}}]};class i{constructor(t,i,e,s,h){this.aspectRatio=0,this.mole=null,this.image=null,this.x=t,this.y=i,this.width=e,h?(this.aspectRatio=h.naturalWidth/e,this.height=h.naturalHeight/this.aspectRatio,this.image=h):this.height=s}render(){this.image?a.drawImage(this.image,this.x,this.y,this.width,this.height):a.drawShape("black",this.x,this.y,this.width,this.height)}}class e{constructor(t,e,s){this.moleHills=[];const h=t.rows,o=t.columns,l=a.width/(o+1),n=s/(h+1),r=l/(o+1),m=n/(h+1);for(let t=0;t<h;t++){let h=[];for(let a=0;a<o;a++){const o=r*(a+1)+l*a,g=s-m*(t+1)-n*(t+1);h.push(new i(o,g,l,n,e))}this.moleHills.push(h)}}render(){for(let t=0;t<this.moleHills.length;t++)for(let i=0;i<this.moleHills[t].length;i++){const e=this.moleHills[t][i];e.mole&&e.mole.render(),e.render()}}update(){for(let t=0;t<this.moleHills.length;t++)for(let i=0;i<this.moleHills[t].length;i++){const e=this.moleHills[t][i];e.mole&&e.mole.update()}}isEmpty(){for(let t=0;t<this.moleHills.length;t++)for(let i=0;i<this.moleHills[t].length;i++){if(this.moleHills[t][i].mole)return!1}return!0}}class s{constructor(t,i,e,s){this.height=0,this.time=0,this.isHit=!1,this.isMissed=!1,this.img=void 0,this.hitImg=void 0,this.missImg=void 0,this.moleConfig=t,this.crawlOutTime=t.crawlOutTime*e,this.maxTime=t.time*e,this.y=i.y,this.moleHillHeight=i.height,s?(this.img=s,this.width=s.naturalWidth/i.aspectRatio,this.maxHeight=s.naturalHeight/i.aspectRatio,this.x=i.x+(i.width-this.width)/2):(this.maxHeight=i.width,this.x=i.x+i.width/4,this.width=i.width/2)}hit(){if(!0!==this.isHit&&(this.isHit=!0,void 0!==this.moleConfig.hit))switch(this.moleConfig.hit.type){case"live":void 0!==a.lives&&(a.lives+=this.moleConfig.hit.amount);break;case"point":a.points+=this.moleConfig.hit.amount,console.log(a.points)}}getHitBox(){return{x1:Math.floor(this.x-2),x2:Math.floor(this.x+this.width+2),y1:Math.floor(this.y-2),y2:Math.floor(this.y+this.height+2)}}miss(){if(!this.isMissed&&(this.isMissed=!0,void 0!==this.moleConfig.miss))switch(this.moleConfig.miss.type){case"live":void 0!==a.lives&&0!==a.lives&&(a.lives+=this.moleConfig.miss.amount);break;case"point":a.points+=this.moleConfig.miss.amount,console.log(a.points)}}render(){this.isHit?(this.height-=this.maxHeight/20,this.height<0&&(this.height=0)):this.height<this.maxHeight&&this.time<this.maxTime?this.height+=this.maxHeight/(this.crawlOutTime/(1e3/a.frameRate)):this.time>=this.maxTime?(this.height-=this.maxHeight/(this.crawlOutTime/(1e3/a.frameRate)),this.height<0&&(this.height=0)):this.time+=1e3/a.frameRate,this.img?a.drawImage(this.img,this.x,this.y,this.width,this.height,this.isHit?"brightness(0%)":void 0,this.height/this.maxHeight*100):a.drawShape(this.isHit?"red":this.moleConfig.color,this.x,this.y,this.width,this.height)}update(){this.time>=this.maxTime&&this.height<=this.moleHillHeight&&!1===this.isMissed&&this.miss()}}class h{constructor(t,i,e){this.spawnedMoles=[],this.speedMultiplyer=1,this.moleImages=[],this.spawnList=[],this.moleTypes=t.moles,this.moleHills=i,this.maxMoles=t.maxMoles,e&&(this.moleImages=e.sort()),this.generateSpawnList()}generateSpawnList(){this.moleTypes.forEach((t=>{for(let i=0;i<t.probability;i++)this.spawnList.push(this.moleTypes.indexOf(t))}))}spawn(){if(this.spawnedMoles.length>=this.maxMoles)return;0===this.spawnList.length&&this.generateSpawnList();let t=!1;for(;!1===t;){let i=Math.round(Math.random()*(this.moleHills.length-1)),e=Math.round(Math.random()*(this.moleHills[0].length-1)),h=this.moleHills[i][e];if(null===h.mole){let i,e=Math.round(Math.random()*(this.spawnList.length-1)),o=this.moleTypes[this.spawnList[e]];this.spawnList.splice(e,1),o.spriteId&&(i=this.moleImages.find((t=>t.name==="mole_"+o.spriteId)));const a=new s(o,h,this.speedMultiplyer,i?.img);h.mole=a,this.spawnedMoles.push(a),t=!0,setTimeout((()=>{this.spawnedMoles.splice(this.spawnedMoles.indexOf(a),1),h.mole=null}),2*o.crawlOutTime*this.speedMultiplyer+o.time*this.speedMultiplyer)}}}}class o{constructor(){console.log("PewPlatform CREATED"),window.addEventListener("message",(t=>{console.log("RECEIVE message",t),this.receive(t.data)})),window.pew=this}receive(t){if(console.log("G: RECEIVE",t),"play"===t.eventName)this.game.play()}init(t,i){this.game=t,i()}updatescore(t){}gamestarted(){console.log("G: SEND","play"),this.sendEvent({eventName:"play"})}play(){this.game.play()}gameover(t){console.log("G: SEND","Gameover"),this.sendEvent({eventName:"gameover",data:{score:t}})}ready(){console.log("G: SEND","Ready"),this.sendEvent({eventName:"ready"})}sendEvent(t){console.log(t),window.top.postMessage(t,"*")}}class a{constructor(){this.time=0,this.tapToPlay=!0,this.playing=!1,this.gameOver=!1,this.finalScore=null,this.images=[],this.skyImage=null,this.floorImage=void 0,this.imageTimer=0,this.getSettingsFromURI(location.search),document.addEventListener("DOMContentLoaded",(()=>{this.preload()})),window.addEventListener("resize",(()=>{a.height=window.innerHeight,a.width=window.innerWidth;const t=document.getElementById("canvas");a.ctx=t.getContext("2d"),a.ctx.canvas.height=a.height,a.ctx.canvas.width=a.width}))}restart(){clearInterval(this.gameLoop),this.time=0,this.moleSpawner.maxMoles=this.config.maxMoles,this.moleSpawner.speedMultiplyer=1,console.log(this.moleSpawner.speedMultiplyer),a.lives=this.config.lives,a.timeLeft=this.config.time,a.points=0,this.finalScore=null,this.gameOver=!1,this.playing=!1,this.tapToPlay=!0,this.pew.ready()}play(){this.pew.gamestarted(),this.gameLoop=setInterval((()=>{this.render(),this.playing&&!this.gameOver&&this.update()}),1e3/a.frameRate)}preload(){if(void 0!==this.config.sprites)for(const[t,i]of Object.entries(this.config.sprites)){let e=new Image;e.onload=()=>{this.images.push({img:e,name:t}),this.imageReady()},e.onerror=()=>{this.images.push({name:t,img:void 0}),this.imageReady()},this.imageTimer+=1,e.src=i.toString()}}imageReady(){this.imageTimer--,0===this.imageTimer&&(console.log("Start loading"),this.load())}load(){console.log("LOAD");const t=document.getElementById("canvas");t.addEventListener("click",(t=>{this.canvasClicked(t)})),t.addEventListener("touchstart",(t=>{this.canvasClicked(t)})),a.ctx=t.getContext("2d"),a.height=window.innerHeight,a.width=window.innerWidth,a.ctx.canvas.height=a.height,a.ctx.canvas.width=a.width,a.lives=this.config.lives,a.timeLeft=this.config.time;const i=this.images.find((t=>"moleHill"===t.name))?.img;this.floorImage=this.images.find((t=>"ground"===t.name))?.img;const s=this.images.filter((t=>"mole"===t.name.split("_")[0]));let l=a.height*this.config.horizonHeight/100;this.grid=new e(this.config,i,l),this.moleSpawner=new h(this.config,this.grid.moleHills,s),this.pew=new o,this.pew.ready(),this.pew.init(this,(()=>{this.restart,this.play}))}canvasClicked(t){if(this.gameOver&&this.grid.isEmpty())return void this.restart();if(this.tapToPlay)return this.tapToPlay=!1,void setTimeout((()=>{this.playing=!0}),1e3);let i,e;t instanceof MouseEvent?(i=t.clientX,e=a.height-t.clientY):(i=t.touches[0].clientX,e=a.height-t.touches[0].clientY);let s=this.moleSpawner.spawnedMoles.sort(((t,i)=>t.y-i.y));for(let t=0;t<s.length;t++){const h=s[t],o=h.getHitBox();if(i>o.x1&&i<o.x2&&e>o.y1&&e<o.y2){h.hit();break}}}render(){a.ctx.clearRect(0,0,a.width,a.height),a.drawShape("#33A8FF",0,0,a.width,a.height),this.gameOver||this.tapToPlay||(a.drawText(a.points.toString(),20,a.height-40,"30px Arial","white","start"),void 0!==a.lives&&(a.drawText(a.lives.toString(),a.width-40,a.height-40,"30px Arial","white","end"),a.drawText(" ♥︎ ",a.width-40,a.height-38,"30px Arial","red","start")),void 0!==a.timeLeft&&(a.drawText(Math.ceil(a.timeLeft/1e3).toString(),.55*a.width,a.height-38,"30px Arial","white","end"),a.drawText(" ⨶ ",.55*a.width,a.height-38,"30px Arial","black","start"))),this.floorImage?a.drawImage(this.floorImage,0,0,a.width,a.height*this.config.horizonHeight/100):a.drawShape("green",0,0,a.width,a.height*this.config.horizonHeight/100),this.grid.render(),this.tapToPlay&&!this.gameOver&&(a.drawShape("rgba(0, 0, 0, 0.5)",0,0,a.width,a.height),a.drawText("Tap to play",a.width/2,a.height-40,"30px Arial","white","center")),this.gameOver&&(a.drawShape("rgba(0, 0, 0, 0.5)",0,0,a.width,a.height),a.drawText("GAME OVER - Score: "+this.finalScore,a.width/2,a.height-40,"30px Arial","white","center"))}update(){if(!this.gameOver&&(this.time+=1e3/a.frameRate,this.time>0)){if(this.config.speedIncrease&&this.time%this.config.speedIncrease.time==0&&this.moleSpawner.speedMultiplyer-(this.config.speedIncrease.increase-1)>0&&(this.moleSpawner.speedMultiplyer-=this.config.speedIncrease.increase-1),this.config.amountOfMolesIncrease&&this.time%this.config.amountOfMolesIncrease.time==0&&this.moleSpawner.maxMoles+this.config.amountOfMolesIncrease.increase<this.config.columns*this.config.rows-2&&(this.moleSpawner.maxMoles+=this.config.amountOfMolesIncrease.increase),!1===this.gameOver&&(void 0!==a.timeLeft&&0===a.timeLeft||void 0!==a.lives&&0===a.lives))return this.finalScore=a.points,this.gameOver=!0,this.playing=!1,void this.pew.gameover(this.finalScore);a.timeLeft&&(a.timeLeft-=10),this.grid.update(),this.moleSpawner.spawn()}}static drawImage(t,i,e,s,h,o,a){if(null!==this.ctx){if(e=this.height-e-h,o&&(this.ctx.filter=o),void 0===a)this.ctx.drawImage(t,i,e,s,h);else{const o=0,l=0,n=t.naturalWidth,r=t.naturalHeight*a/100;this.ctx.drawImage(t,o,l,n,r,i,e,s,h)}this.ctx.filter="none"}}static drawShape(t,i,e,s,h){null!==this.ctx&&(h<0&&(h=0),e=this.height-e-h,this.ctx.fillStyle=t,this.ctx.fillRect(i,e,s,h))}static drawText(t,i,e,s,h="white",o="center"){null!==this.ctx&&(e=this.height-e,this.ctx.textAlign=o,this.ctx.font=s,this.ctx.fillStyle=h,this.ctx.fillText(t,i,e))}getSettingsFromURI(i){let e;const s=i.split("&");for(let t of s)"s"===t[0]&&(e=atob(t.split("=")[1]));if(void 0===e)return void(this.config=t);let h="{",o=e.split("\n");o.forEach((t=>{const i=t.split("=");if(1===i.length)return;let e='"'+i[0]+'": '+i[1];o.indexOf(t)<o.length-1&&(e+=","),h+=e})),h+="}",this.config=JSON.parse(h)}}a.points=0,a.lives=void 0,a.timeLeft=void 0,a.frameRate=100;new a;
//# sourceMappingURL=index.e897ebb8.js.map
