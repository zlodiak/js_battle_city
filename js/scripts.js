class Game {

  constructor(initObj) {
    this.initObj = initObj;
    this.gameEl = initObj.gameEl;
    this.levelCnt = 1;
    this.levelCntMax = 3;
    this.playerLife = 100;
    this.menu = new Menu(this);
    this.menuSettings = null;
  }

  reConstructor() {
    this.gameEl = this.initObj.gameEl;
    this.levelCnt = 1;
    this.levelCntMax = 3;
    this.playerLife = 100;
    this.menu = new Menu(this);    
  }

  controller(action, menuSettings) {
    let action_ = this.isGameComplete() ? 'gameCompleteScreen' : action;
    if (menuSettings) {
      this.menuSettings = menuSettings;
    }
    
    console.log(this.menuSettings)

    switch(action_) {
      case 'infoScreen':
        new InfoScreen(this);
        break;
      case 'gameCompleteScreen':
        new GameCompleteScreen(this);      
        break;
      case 'level':
        new Level(this, this.menuSettings);      
        break;
      case 'gameOverScreen':
        new GameOverScreen(this);     
        break;        
    }
  }

  isGameComplete() {
    return this.levelCnt > this.levelCntMax;
  }

}

class Menu {

  constructor(gameObj) {
    this.gameObj = gameObj;

    this.enemiesCntIndex = 2;
    this.enemiesCntLabels = {
      0: 'Мало',
      1: 'Средне',
      2: 'Много'
    };
    
    this.wallsStrengthIndex = 2;
    this.wallsStrengthLabels = {
      0: 'Кирпичные',
      1: 'Железобетонные',
      2: 'Алмазные'
    };

    this.render();
    this.startKeysListen();
  }

  render() {
    this.gameObj.gameEl.innerHTML = '';

    const menuTpl = document.querySelector('#menuTpl');
    const menuTplClone = menuTpl.content.cloneNode(true);
    this.gameObj.gameEl.appendChild(menuTplClone);
    
    const enemiesCntEl = document.getElementById('enemiesCnt');
    if (enemiesCntEl) {
      enemiesCntEl.innerHTML = this.enemiesCntLabels[this.enemiesCntIndex];
    }

    const wallsStrengthEl = document.getElementById('wallsStrength');
    if (wallsStrengthEl) {
      wallsStrengthEl.innerHTML = this.wallsStrengthLabels[this.wallsStrengthIndex];
    }    
  }  

  startKeysListen() {
    this._keysListenHandler = this._keysListen.bind(this);
    document.addEventListener('keypress', this._keysListenHandler);
  }

  stopKeysListen() {
    document.removeEventListener('keypress', this._keysListenHandler);
    delete this._keysListenHandler;
  }

  _keysListen(e) {    
    switch(e.keyCode) {
      case 49:
        ++this.enemiesCntIndex;
        if (this.enemiesCntIndex > 2) { this.enemiesCntIndex = 0; }
        this.render();
        break; 
      case 50:
        ++this.wallsStrengthIndex;
        if (this.wallsStrengthIndex > 2) { this.wallsStrengthIndex = 0; }
        this.render();
        break;  
      case 51:
        this.stopKeysListen();  
        this.gameObj.controller('infoScreen', {
          enemiesCntIndex: this.enemiesCntIndex,
          wallsStrengthIndex: this.wallsStrengthIndex
        });
    }     
  }

}

class InfoScreen {

  constructor(gameObj) {
    this.gameObj = gameObj;
    this.render();
    this.startKeysListen();
  }

  render() {
    this.gameObj.gameEl.innerHTML = '';

    const infoScreenTpl = document.querySelector('#infoScreenTpl');
    const infoScreenTplClone = infoScreenTpl.content.cloneNode(true);
    this.gameObj.gameEl.appendChild(infoScreenTplClone);

    const levelCntEl = document.getElementById('levelCnt');
    if (levelCntEl) { levelCntEl.innerHTML = this.gameObj.levelCnt; }
  }

  destroy() {
    const wrapInfoScreenEl = document.getElementById('wrapInfoScreen');    
    if (wrapInfoScreenEl) {
      wrapInfoScreenEl.classList += ' hide';
    }

    setTimeout(() => {
      this.gameObj.controller('level');
    }, 1000);    
  }

  startKeysListen() {
    this._keysListenHandler = this._keysListen.bind(this);
    document.addEventListener('keypress', this._keysListenHandler);
  }

  stopKeysListen() {
    document.removeEventListener('keypress', this._keysListenHandler);
    delete this._keysListenHandler;
  }  

  _keysListen() {
    this.stopKeysListen();
    this.destroy();
  }

}

class GameOverScreen {

  constructor(gameObj) {
    this.gameObj = gameObj;
    this.render();
  }

  render() {
    this.gameObj.gameEl.innerHTML = '';

    const gameOverScreenTpl = document.querySelector('#gameOverScreenTpl');
    const gameOverScreenTplClone = gameOverScreenTpl.content.cloneNode(true);
    this.gameObj.gameEl.appendChild(gameOverScreenTplClone);

    setTimeout(() => {        
      this.destroy();
    }, 1000);      
  }

  destroy() {
    const gameOverTextEl = document.getElementById('gameOverText');    
    if (gameOverTextEl) {
      gameOverTextEl.classList += ' transform';
      setTimeout(() => {
        this.gameObj.reConstructor();    
      }, 2000);       
    }
   
  }

}

class GameCompleteScreen {

  constructor(gameObj) {
    this.gameObj = gameObj;
    this.render();
  }

  render() {
    this.gameObj.gameEl.innerHTML = '';

    const gameCompleteScreenTpl = document.querySelector('#gameCompleteScreenTpl');
    const gameCompleteScreenTplClone = gameCompleteScreenTpl.content.cloneNode(true);
    this.gameObj.gameEl.appendChild(gameCompleteScreenTplClone);

    setTimeout(() => {        
      this.destroy();
    }, 1000);      
  }

  destroy() {
    const gameCompleteTextEl = document.getElementById('gameCompleteText');    
    if (gameCompleteTextEl) {
      gameCompleteTextEl.classList += ' transform';
      setTimeout(() => {
        this.gameObj.reConstructor();    
      }, 2000);       
    }   
  }

}

class Level {

  constructor(gameObj, menuSettings) {
    console.log(menuSettings)
    this.gameObj = gameObj;
    this.wallsStrengthIndex = menuSettings.wallsStrengthIndex;
    this.wallsCnt = 30;
    this.walls = [];    
    this.render();
  }

  generateWalls() {
    for (let id = 0; id < this.wallsCnt; id++) {
      const wall = new Wall(this, this.gameObj.gameEl, id, this.wallsStrengthIndex);
      this.walls.push(wall);
    }
  }

  deleteWall(id) {
    this.walls.forEach((w, i) => {
      if (this.walls[i] && this.walls[i].id === id) {
        this.walls.splice(i, 1);
      }      
    })
  }

  render() {
    this.gameObj.gameEl.innerHTML = '';
    this.generateWalls();

    // const next = document.createElement('div');
    // next.id = 'next';
    // next.innerHTML = 'to next level';
    // this.gameObj.gameEl.appendChild(next);

    // const end = document.createElement('div');
    // end.id = 'end';
    // end.innerHTML = 'to game over';
    // this.gameObj.gameEl.appendChild(end);  

    // next.addEventListener('click', () => { 
    //   this.gameObj.levelCnt++;
    //   this.gameObj.controller('infoScreen');      
    // });  

    // end.addEventListener('click', () => { 
    //   this.gameObj.playerLife = 0;
    //   this.gameObj.controller('gameOverScreen');     
    // });
  }

}

class Wall {

  constructor(levelObj, fieldEl, id, wallsStrengthIndex) {
    this.levelObj = levelObj;
    this.fieldEl = fieldEl;
    this.id = id;
    this.xCoord = Math.floor(Math.random() * (10));
    this.yCoord = Math.floor(Math.random() * (10));
    this.strength = wallsStrengthIndex;    
    this.size = 80;
    switch(wallsStrengthIndex) {
      case 0: this.background = 'red'; break;
      case 1: this.background = 'grey'; break;
      case 2: this.background = 'cyan'; break;                
    }
    this.render();
  }

  render() {
    const wallEl = document.createElement('div');
    wallEl.id = 'wall_' + this.id;
    wallEl.classList += 'wall';
    wallEl.style.background = this.background;
    wallEl.style.left = this.xCoord * this.size + 'px';
    wallEl.style.top = this.yCoord * this.size + 'px';
    this.fieldEl.appendChild(wallEl);

    document.getElementById('wall_' + this.id).addEventListener('click', () => {
     --this.strength;
     if (this.strength < 0) { this.destroy(); }      
    });
  }

  destroy() {
    const wallEl = document.getElementById('wall_' + this.id);
    if (wallEl) {
      wallEl.remove();
      this.levelObj.deleteWall(this.id);
    }
  }

}