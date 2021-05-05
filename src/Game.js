import {gsap} from 'gsap';
import Stage from './Stage'
import Enemy from './Enemy'
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import {howl, howler} from 'howler';
import HitTest from "./HitTest";

export default class Game{

constructor(){

    this.myStage = new Stage();
    this.scene = this.myStage.scene;
    this.scene.sortableChildren = true;
    this.background = this.myStage.bg;
    this.si = this.myStage.stageInfo;

    this.ht = new HitTest();

    this.SoundArray = ["ia1", "ia2"];


    let assets = [
        '../assets/spritesheet/ninjarack.json',
        './assets/images/background.jpg',
        '../assets/images/ninja-jump.png',
        '../assets/images/play.png'
      ];

      const loader = PIXI.Loader.shared
      .add(assets)
      .add('alienspine', '../assets/spritesheet/alien-spine/alienboss.json')

/*
      loader.onProgress.add((percent) => {
        console.log(percent.progress)

          // I NEED TO SHOW PRELOADING BAR PROGRESS IN HERE

        });

       loader.onComplete.add(() => {

       });
*/


      .load((loader,res) => {

        console.log('ready for game');

        let bgTexture = PIXI.Texture.from('./assets/images/background.jpg');
        let _bg = new PIXI.Sprite(bgTexture);
       this.background.addChild(_bg);

       let playTexture = PIXI.Texture.from("./assets/images/play.png");
       let play = new PIXI.Sprite(playTexture);
       play.anchor.set(0.5);
       play.x=512;
       play.y=250;
       play.interactive = true;
       play.buttonMode = true;
       this.scene.addChild(play);

       play.on('pointerdown', (event) => {

        event.stopPropagation();

        this.si.app.stage.interactive = true;

        console.log('start game');


        gsap.to(event.currentTarget, {
            duration: 0.5,
            delay:0.2,
              y: play.y - 350,

              ease: "Elastic.easeInOut",
            });

            let soundSwirp = new Howl({
                src:['./assets/sound/effekt_swish.mp3'],

                volume: 0.2
                })

                var timerid = setTimeout(() => {
                  soundSwirp.play();
                }, 500);

                let sound = new Howl({
                    src:['./assets/sound/musicloop.mp3'],
                    autoplay: true,
                    loop: true,
                    volume: 0.5

                    })

                    this.enemy = new Enemy({
                        name:res.alienspine,
                        addTo:this.scene
                       });

       })

       this.hitareaNinja = new PIXI.Graphics();
       this.hitareaNinja.beginFill(0xDE3249);
       this.hitareaNinja.drawRect(500-150, 550, 300, 200);
       this.hitareaNinja.alpha=0.5;
       this.hitareaNinja.endFill();
       this.scene.addChild(this.hitareaNinja);

    let sheet = PIXI.Loader.shared.resources['../assets/spritesheet/ninjarack.json'].spritesheet;

      this.ninja = new PIXI.AnimatedSprite(sheet.animations['alien']);
      this.ninja.anchor.set(0.5);
      this.ninja.x = 512;
      this.ninja.y = 768 - 150;

      this.ninja.interactive = true;
      this.ninja.buttonMode = true;
      this.ninja.zIndex = 2;
      this.ninja.animationSpeed = 0.5;

      this.ninja.play();
      this.scene.addChild(this.ninja);

      //this.si.app.stage.interactive = true;

      this.si.app.stage.on('pointerdown', (event) => {

        this.ninja.stop(); // stop ninja animation
        this.ninja.texture = PIXI.Texture.from('../assets/images/ninja-jump.png'); //skift texture til jump;

        let newPosition = event.data.getLocalPosition(this.background);
        let mX = event.data.global.x;
        mX > this.si.appWidth/2 ? this.ninja.scale.x = -1 : this.ninja.scale.x = 1;

        gsap.to(this.ninja, {
            duration: 0.2,
            x: newPosition.x-300,
            y:newPosition.y,

            ease: "Circ.easeOut",

            onComplete: () => {

              gsap.to(this.ninja, {
                duration: 0.2,

                x: 500,
                y:768-150,

                ease: "Circ.easeOut",
              });

              this.ninja.play();
            }, //END: onComplete
          });

          this.hitSound = new Howl({
            src:['./assets/sound/effekt_swish.mp3'],
            volume:0.5
            })

            this.hitSound.play();

        let getFromSoundArray = this.SoundArray[Math.floor(Math.random() * this.SoundArray.length)];



            this.ia = new Howl({
              src:['./assets/sound/' + getFromSoundArray + '.mp3'],
              volume: 0.1
              })

              this.ia.play();

      }) //END eventHandler


      }) //END LOADER


      let ticker = PIXI.Ticker.shared;

      ticker.add((delta) => {

        if(this.enemy != undefined){

          this.enemy.enemies.forEach(_enemy => {


            if (this.ht.checkme(this.ninja, _enemy.getChildAt(1) ) && _enemy.alive == true) {

                const currentEnenmySpriteSheet = _enemy.getChildAt(0);
                currentEnenmySpriteSheet.state.setAnimation(0, 'die', true);


                if(_enemy.alive){


                  this.hitSound = new Howl({
                    src:['./assets/sound/effekt_hit.mp3'],
                    volume: 0.2
                    })

                    this.hitSound.play();

                }





               let enemyDieTimeline = gsap.timeline({
                onComplete: () =>{
                  this.scene.removeChild(_enemy);

                }
              });
              enemyDieTimeline.to(_enemy, {y: 300, duration: .7, ease: "Circ.easeOut"});
              enemyDieTimeline.to(_enemy, {y: 1200, duration: .5, ease: "Circ.easeIn"});


              _enemy.alive = false;
              _enemy.attack = false;

            }// END if hittest

            if (this.ht.checkme(this.hitareaNinja, _enemy.getChildAt(1)) && _enemy.attack == true) {

              const currentEnenmySpriteSheetAttack = _enemy.getChildAt(0);
              currentEnenmySpriteSheetAttack.state.setAnimation(0, 'attack', true);

              let timeToNinjaIsHurt =  setTimeout(() => {

                this.ninja.stop();
                this.ninja.texture = PIXI.Texture.from('../assets/images/ninja-hurt.png');


              gsap.to(this.ninja, {
                duration: 0.7,
                y:550,

                ease: "Circ.easeOut",
                onComplete: () => {
                  this.ninja.play();

                  gsap.to(this.ninja, {
                    duration: 0.4,
                    y:768-150

                  })


                   }
                  })

                  },300)



          _enemy.alive = false;
          _enemy.attack = false;


          gsap.to(_enemy, {
            duration: 0.7,
            y:550,
            ease: "Circ.easeOut",
            onComplete: () => {

             gsap.to(_enemy, {
              duration: 0.5,
              y:768-50,
              ease: "Circ.easeOut"

             })

             currentEnenmySpriteSheetAttack.state.setAnimation(0, 'walk', true);

              }

              }) // END gsap


            } //END hitTest


          })//END forEach
        } // END if forEach


      }) // END ticker






   }// END constructor


}
