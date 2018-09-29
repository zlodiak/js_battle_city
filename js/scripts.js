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
          this.infoScreen = new InfoScreen({
            gameObj: this,
            gameEl: this.gameEl,
            topText: 'Уровень ' + this.levelCnt
          });
        break;

      case 'gameCompleteScreen':
        this.gameCompleteScreen = new GameCompleteScreen({
          gameObj: this,
          gameEl: this.gameEl
        });      
        break;

      case 'level':
        this.level = new Level({
          gameObj: this,
          gameEl: this.gameEl
        });      
        break;

      case 'gameOverScreen':
        this.gameOverScreen = new GameOverScreen({
          gameObj: this,
          gameEl: this.gameEl
        });     
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

  constructor(initObj) {
    this.gameObj = initObj.gameObj;
    this.gameEl = initObj.gameEl;
    this.topText = initObj.topText;

    this.render();
    this.startKeysListen();
  }

  render() {
    this.gameEl.innerHTML = '';

    const infoScreenTpl = document.querySelector('#infoScreenTpl');
    const infoScreenTplClone = infoScreenTpl.content.cloneNode(true);
    this.gameEl.appendChild(infoScreenTplClone);

    const topText = document.getElementById('infoTextTop');
    if (topText) { topText.innerHTML = this.topText; }
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

  constructor(initObj) {
    this.gameObj = initObj.gameObj;
    this.gameEl = initObj.gameEl;

    this.render();
  }

  render() {
    this.gameEl.innerHTML = '';

    const gameOverScreenTpl = document.querySelector('#gameOverScreenTpl');
    const gameOverScreenTplClone = gameOverScreenTpl.content.cloneNode(true);
    this.gameEl.appendChild(gameOverScreenTplClone);

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

  constructor(initObj) {
    this.gameObj = initObj.gameObj;
    this.gameEl = initObj.gameEl;

    this.render();
  }

  render() {
    this.gameEl.innerHTML = '';

    const gameCompleteScreenTpl = document.querySelector('#gameCompleteScreenTpl');
    const gameCompleteScreenTplClone = gameCompleteScreenTpl.content.cloneNode(true);
    this.gameEl.appendChild(gameCompleteScreenTplClone);

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

  constructor(initObj) {
    this.gameObj = initObj.gameObj;
    this.gameEl = initObj.gameEl;
    this.render();
  }

  render() {
    this.gameEl.innerHTML = '';

    const next = document.createElement('div');
    next.id = 'next';
    this.gameEl.appendChild(next);

    const end = document.createElement('div');
    end.id = 'end';
    this.gameEl.appendChild(end);  

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