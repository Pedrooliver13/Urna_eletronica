import { Urna } from './module/urna.js';

const urna = new Urna(
  "[data-urna='key']",
  "[data-urna='voto']",
  "[data-urna='title']",
  "[data-urna='results']",
);
urna.addButtons('.btn--green', "[data-urna='corrects']", "[data-urna='clear']");
urna.init();
