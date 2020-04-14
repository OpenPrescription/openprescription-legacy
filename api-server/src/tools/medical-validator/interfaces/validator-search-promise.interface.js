export default class MedicalSearchPromise {

  constructor(validator) {
    this.name = validator.name || validator.constructor.name;
    this.validation = validator.validate();
  }
}
