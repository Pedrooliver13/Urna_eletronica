import { etapas } from './etapas.js';

export class Urna {
  constructor(keyNumber, wrapper) {
    this.keyNumber = document.querySelectorAll(keyNumber);
    this.wrapper = document.querySelector(wrapper);
    
    this.slidePosts = 0;
    this.slideDigits = 0;

    this.totalDigits = etapas.reduce((acc, { numeros }) => {
      return [...acc, numeros];
    }, []);
  }

  appendHtml() {
    for (let index = 0; index < this.totalDigits[this.slidePosts]; index++) {
      const div = this.createDigit();
      this.wrapper.appendChild(div);
    }
  }

  activeDigits() {
    this.wrapperArray = [...this.wrapper.children];
    this.wrapperArray[this.slideDigits].classList.add('active');
  }

  createDigit() {
    const div = document.createElement('div');
    div.classList.add('urna__digits');
    return div;
  }

  getValue({ target }) {
    const content = target.innerText;
    return content;
  }

  addButtonEvent() {
    this.keyNumber.forEach((item) => {
      item.addEventListener('click', this.appendHtml);
    });
  }

  onBind() {
    this.getValue = this.getValue.bind();
  }

  init() {
    this.onBind();
    this.addButtonEvent();
    this.appendHtml();
    this.activeDigits();

    return this;
  }
}

export class UrnaNav extends Urna {
  constructor(buttons, wrapper) {
    super(buttons, wrapper);
  }
}
