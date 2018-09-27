class Game {

  constructor(initObj) {
    this.gameEl = initObj.gameEl;
    this.levelNum = null;    
    this.menu = new Menu({
      gameEl: this.gameEl,
      exitCallback: this.startGame
    });
  }

  startGame() {
    delete this.menu;
    this.levelNum = 1;

    // while (this.levelNum < 3) {
      this.infoScreen = new infoScreen({
        gameEl: this.gameEl,
        topText: 'Уровень ' + this.levelNum,
        bottomText: 'Нажмите любую клавишу для старта',
        exitCallback: this.activationLevel
      });
    // }
  }

  activationLevel() {
    alert('activationLevel')
    // console.log('this.levelNum', this.levelNum)
    // console.log('this.infoScreen', this.infoScreen)
    // delete this.infoScreen;
    // alert('level')
  }  

}

class Menu {

  constructor(initObj) {
    this.gameEl = initObj.gameEl;
    this.exitCallback = initObj.exitCallback;

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

    this.infoScreen = null;

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
        this.exitCallback();            
    }     
  }



}


class infoScreen {

  constructor(initObj) {
    console.log(initObj)
    this.gameEl = initObj.gameEl;
    this.topText = initObj.topText;
    this.bottomText = initObj.bottomText;
    this.exitCallback = initObj.exitCallback;

    this.render();
    document.addEventListener('keypress', () => {
      console.log('close info screen');
      this.destroy();
    });
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
      this.exitCallback();
    }, 1000);
    
  }

}