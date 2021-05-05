import {gsap} from 'gsap';

import setRandomInterval from 'set-random-interval';

export default class Enemy{

constructor(items){

    this.resname = items.name;
    this.container = items.addTo;
  
    this.startFrom = 0;
    this.endAt = 0;
    this.front = 0;
    this.enemyArray= [];
    this.enemyDuration = [20,21,22,23,24,25,26,27,28,29,30,40,50];
    
    
    this.from = ["left", "right"];
  
    this.counter=0; 


    const interval = setRandomInterval(() =>{

        var getFrom = this.from[Math.floor(Math.random() * this.from.length)];
        this.counter++;
      
      if(getFrom == "left") {
      
        this.startFrom= -400;
        this.endAt = 1700;
        this.front = -1 ; // Hvis man bruger en scale.x egenskab på congtaineren og sætter den til -1 vil den flippe horizintalt
      
      
      }else{
      
        this.startFrom= 1700;
        this.endAt = -400;
        this.front = 1; ;// Hvis man bruger en scale.x egenskab på congtaineren og sætter den til -1 vil den flippe horizintalt
      }

      console.log(getFrom, this.startFrom, this.endAt);


      this.enemyContainer = new PIXI.Container();
      this.enemyContainer.x=this.startFrom;
      this.enemyContainer.data=this.enemyDuration[Math.floor(Math.random() * this.enemyDuration.length)];
      this.enemyContainer.alive = true; // Denne kan sættes til false hvis denne specifikke enemy er død og sikre at vi ikke interagere med den når den er død.
      this.enemyContainer.attack = true;
       this.enemyContainer.id=this.counter;
      this.enemyContainer.y=768-50; // placering på y aksen
      this.enemyContainer.scale.x =  this.front; // hvilken vej skal fjenden vende
      this.enemyContainer.zIndex = 1;
      this.container.addChild( this.enemyContainer );
      this.enemyArray.push(this.enemyContainer); // alle enemies bliver lagt I et array, så vi kan styre de enkelte enemies.
      
      let alienEnemy = new PIXI.spine.Spine(this.resname.spineData);
      alienEnemy.x=0;
      alienEnemy.y=0;
      alienEnemy.state.setAnimation(0, 'walk', true);
      this.enemyContainer.addChild(alienEnemy);

      const hitarea = new PIXI.Graphics();
      hitarea.beginFill(0xDE3249);
      hitarea.drawRect(-25, -75, 50, 50);
      hitarea.alpha=0.5;
      hitarea.endFill();
      this.enemyContainer.addChild(hitarea);

      gsap.to(this.enemyContainer, {
        duration:this.enemyContainer.data,
         x: this.endAt,
         ease: "Power0.easeNone",
         onComplete: () => {
    
          this.container.removeChild(this.enemyArray[0]);
          this.enemyArray.shift();
    
         }
    
        });


    },1000,5000)

    }

    get enemies(){

        return this.enemyArray;
        
        }

}