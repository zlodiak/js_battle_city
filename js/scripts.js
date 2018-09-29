class Game {

  constructor(initObj) {
    this.initObj = initObj;
    this.gameEl = initObj.gameEl;
    this.levelCnt = 1;
    this.levelCntMax = 3;
    this.playerLife = 100;
    this.menu = new Menu(this);
  }

  reConstructor() {
    this.gameEl = this.initObj.gameEl;
    this.levelCnt = 1;
    this.levelCntMax = 3;
    this.playerLife = 100;
    this.menu = new Menu(this);    
  }

  controller(action) {
    switch(action) {
      case 'infoScreen':
          this.infoScreen = new InfoScreen(this);
        break;

      case 'gameCompleteScreen':
        this.gameCompleteScreen = new GameCompleteScreen(this);      
        break;

      case 'level':
        this.level = new Level(this);      
        break;

      case 'gameOverScreen':
        this.gameOverScreen = new GameOverScreen(this);     
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
      0: 'Много',
      1: 'Средне',
      2: 'Мало'
    };
    
    this.wallsStrengthIndex = 2;
    this.wallsStrengthLabels = {
      0: 'Алмазные',
      1: 'Железобетонные',
      2: 'Кирпичные'
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
        this.gameObj.controller('infoScreen');
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

  constructor(gameObj) {
    this.gameObj = gameObj;
    this.render();
  }

  render() {
    this.gameObj.gameEl.innerHTML = '';

    const next = document.createElement('div');
    next.id = 'next';
    next.innerHTML = 'to next level';
    this.gameObj.gameEl.appendChild(next);

    const end = document.createElement('div');
    end.id = 'end';
    end.innerHTML = 'to game over';
    this.gameObj.gameEl.appendChild(end);  

    next.addEventListener('click', () => { 
      this.gameObj.levelCnt++;
      if (this.gameObj.isGameComplete()) {
        this.gameObj.controller('gameCompleteScreen');
      } else {
        this.gameObj.controller('infoScreen');
      }      
    });  

    end.addEventListener('click', () => { 
      this.gameObj.playerLife = 0;
      this.gameObj.controller('gameOverScreen');     
    });
  }

}