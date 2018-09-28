class Game {

  constructor(initObj) {
    this.gameEl = initObj.gameEl;
    this.levelCnt = 1;
    this.playerLife = 100;

    this.menu = new Menu({
      gameObj: this,
      gameEl: this.gameEl
    });
  }

  destroyMenu() {
    console.log('destroy menu');
    this.infoScreen = new InfoScreen({
      gameObj: this,
      gameEl: this.gameEl,
      topText: 'Уровень ' + this.levelCnt,
      bottomText: 'Нажмите любую клавишу для старта'
    });
  }

  destroyInfoScreen() {
    console.log('destroyInfoScreen');
    this.level = new Level({
      gameObj: this,
      gameEl: this.gameEl,
      topText: 'Уровень ' + this.level,
      bottomText: 'Нажмите любую клавишу для старта'
    });
  }

  destroyLevel(isGameOver) {
    console.log('destroyLevel', isGameOver);
    if (isGameOver) {
      alert('game over');
    } else {
      ++this.levelCnt;
      this.destroyMenu();
    }    
  }

}

class Menu {

  constructor(initObj) {
    this.gameObj = initObj.gameObj;
    this.gameEl = initObj.gameEl;

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
    this.gameEl.innerHTML = '';

    const menuTpl = document.querySelector('#menuTpl');
    const menuTplClone = menuTpl.content.cloneNode(true);
    this.gameEl.appendChild(menuTplClone);
    
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
        console.log('startt');
        this.gameObj.destroyMenu();
    }     
  }

}


class InfoScreen {

  constructor(initObj) {
    this.gameObj = initObj.gameObj;
    this.gameEl = initObj.gameEl;
    this.topText = initObj.topText;
    this.bottomText = initObj.bottomText;

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

    const bottomText = document.getElementById('infoTextBottom');
    if (bottomText) { bottomText.innerHTML = this.bottomText; }
  }

  destroy() {
    const wrapInfoScreenEl = document.getElementById('wrapInfoScreen');    
    if (wrapInfoScreenEl) {
      wrapInfoScreenEl.classList += ' hide';
    }

    setTimeout(() => {
      this.gameObj.destroyInfoScreen();
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

    next.addEventListener('click', () => { this.gameObj.destroyLevel(false); });  
    end.addEventListener('click', () => { this.gameObj.destroyLevel(true); });  
  }

}