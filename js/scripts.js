class Game {

  constructor(initObj) {
    this.gameEl = initObj.gameEl;
    this.menu = new Menu({
      gameEl: this.gameEl
    });
  }

}

class Menu {

  constructor(initObj) {
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
    console.log(this)
    switch(e.keyCode) {
      case 49:
        console.log(this)
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
        alert('start game');
    }     
  }

}