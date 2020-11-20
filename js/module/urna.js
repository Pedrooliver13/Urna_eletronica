import { etapas } from './etapas.js';

export class Urna {
  constructor(keyNumber, wrapper, title, results) {
    this.keyNumber = document.querySelectorAll(keyNumber);
    this.wrapper = document.querySelector(wrapper);
    this.title = document.querySelector(title);
    this.resultsWrapper = document.querySelector(results);

    this.voted = [];
    this.results = [];

    this.slidePosts = 0;
    this.slideDigits = 0;

    this.totalDigits = etapas.reduce((acc, { numeros }) => {
      return [...acc, numeros];
    }, []);
  }

  appendHtml() {
    this.wrapper.innerHTML = '';

    for (let index = 0; index < this.totalDigits[this.slidePosts]; index++) {
      const divElement = this.createDigit();
      this.wrapper.appendChild(divElement);
    }
  }

  activeDigits() {
    this.wrapperArray = [...this.wrapper.children];
    this.wrapperArray.forEach((item, index) => {
      index === this.slideDigits && item.classList.add('active');
    });
  }

  removeActive() {
    this.wrapperArray.forEach((item) => item.classList.remove('active'));
  }

  createDigit() {
    const div = document.createElement('div');
    div.classList.add('urna__digits');
    return div;
  }

  insertValue(content) {
    const digitActive = this.wrapperArray[this.slideDigits];
    digitActive.innerText = content;
    this.slideDigits++;
    this.voted.push(content);

    if (this.wrapperArray[0].innerText === '0')
      this.resultsWrapper.innerText = 'Voto Nulo';

    if (this.slideDigits === this.wrapperArray.length) {
      const votedString = this.voted.join();
      const votedClear = votedString.replace(/\D/g, '');
      this.voted = votedClear;

      this.getCandidate();
      this.showCandidate();
    }

    this.removeActive();
    this.activeDigits();
  }

  getCandidate() {
    this.candidates = etapas[this.slidePosts].candidatos.reduce(
      (acc, candidato) => {
        return [...acc, candidato];
      },
      [],
    );
  }

  showCandidate() {
    this.candidato = this.candidates.filter(
      ({ numero }) => numero === this.voted,
    );

    this.results.push(...this.candidato);

    const html = this.candidato.map(
      ({ nome, partido }) => `
      <div class="urna__candidate">
        <p>Nome: ${nome}</p>
        <p>Partido: ${partido}</p>
      </div>
    `,
    );

    this.title.innerHTML += html;
  }

  getValue({ target }) {
    if (this.wrapperArray[this.slideDigits]) {
      const content = target.innerText;
      return this.insertValue(content);
    }
  }

  nextFase() {
    if (this.slidePosts <= etapas.length) {
      this.slidePosts++;
      this.slideDigits = 0;
    }

    if (this.slidePosts > etapas.length - 1) return this.showResults();

    this.correctsVote();
  }

  confirmVote() {
    const firstItem = this.wrapperArray[0];
    if (firstItem.innerText !== '') this.nextFase();
  }

  correctsVote() {
    this.resultsWrapper.innerText = '';

    if (this.slidePosts < etapas.length) {
      const titleCargo = etapas[this.slidePosts].titulo;
      this.title.innerHTML = `<h3>${titleCargo}</h3>`;
      this.slideDigits = 0;
    }

    this.appendHtml();
    this.activeDigits();
    this.voted = [];
  }

  clearVote() {
    this.wrapperArray.forEach((item) => (item.innerText = '0'));
    this.resultsWrapper.innerText = 'Voto Nulo';
  }

  showResults() {
    const howVoted = document.querySelector('.results');

    const html = `
      <div class="urna__end">
        FIM
      </div>
    `;

    const html2 = this.results.map(
      ({ nome, partido }) => `
      <div class="results__candidate">
        <h3>Nome: ${nome}</h3>
        <p>Partido: ${partido}</p>
      </div>
    `
    );

    howVoted.innerHTML += html2;
    this.wrapper.parentElement.innerHTML = html;
  }

  addButtons(keyConfirm, keyCorrects, keyClear) {
    this.confirmButton = document.querySelector(keyConfirm);
    this.correctsButton = document.querySelector(keyCorrects);
    this.clearButton = document.querySelector(keyClear);
  }

  addButtonEvent() {
    this.keyNumber.forEach((item) => {
      item.addEventListener('click', this.getValue);
    });
    this.confirmButton.addEventListener('click', this.confirmVote);
    this.correctsButton.addEventListener('click', this.correctsVote);
    this.clearButton.addEventListener('click', this.clearVote);
  }

  onBind() {
    this.getValue = this.getValue.bind(this);
    this.confirmVote = this.confirmVote.bind(this);
    this.correctsVote = this.correctsVote.bind(this);
    this.clearVote = this.clearVote.bind(this);
  }

  init() {
    this.onBind();
    this.appendHtml();
    this.addButtonEvent();
    this.addButtons();
    this.activeDigits();

    return this;
  }
}
