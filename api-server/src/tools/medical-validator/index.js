import validators from "../../config/medical-validator";
import ValidatorResults from "./interfaces/validator-result.interface";
import ValidatorSearch from "./interfaces/validator-search-promise.interface";
import Doctor from "./interfaces/doctor.interface";

export default class MedicalValidator {
  constructor(country, doctor) {
    if (!doctor instanceof Doctor)
      throw new Error("Must be a instance of Doctor");
    if (!validators.hasOwnProperty(country))
      throw new Error("Country doctor ID validatior not found");
    const singleValidator = validators[country];
    this.validators = Array.isArray(singleValidator)
      ? singleValidator
      : [singleValidator];
    this.doctor = doctor;
    this.strict = false;
  }

  _mappedSearchPromise() {
    return this.validators.map((v) => {
      const validator = new v(this.doctor);
      return new ValidatorSearch(validator);
    });
  }

  setStrict() {
    this.strict = true;
  }

  static async validate(country, doctor, strict = false) {
    const medicalValidator = new MedicalValidator(country, doctor);
    const validations = [];
    const validationPromises = medicalValidator._mappedSearchPromise();
    return Promise.all(validationPromises.map((v) => v.validation)).then(
      (vResults) => {
        vResults.forEach((results, index) => {
          const validationSearch = validationPromises[index];
          validations.push(
            new ValidatorResults(validationSearch.name, results)
          );
        });
        let valid = false;
        const booleanResults = validations.map((v) => v.results.valid);
        if (strict) valid = booleanResults.reduce((a, c) => a && c);
        else valid = booleanResults.reduce((a, c) => a || c);
        return {
          valid,
          validations: validations,
        };
      }
    );
  }
}
