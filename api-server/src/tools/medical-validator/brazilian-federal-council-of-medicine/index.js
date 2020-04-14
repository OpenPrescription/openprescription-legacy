import rp from "request-promise";
import DoctorValidation from "../interfaces/doctor-validation.interface";

export default class BrazilianFederalCouncilofMedicine {

  constructor(doctor) {
    this.doctor = doctor;
    this.name = "cfm";
  }

  _removeStateFromDoctorId(doctorId) {
    return doctorId.replace(/-\w{2}$/, "");
  }

  _getFirstName(doctorName) {
    return doctorName.split(" ")[0];
  }

  _request() {
    console.log(this.doctor);
    return rp({
      url: "https://kvglzg9apl.execute-api.us-east-1.amazonaws.com/search/br",
      json: true,
      qs: {
        doctorid: this._removeStateFromDoctorId(this.doctor.id),
        doctorname: this._getFirstName(this.doctor.name),
      },
    });
  }

  async validate() {
    const response = await this._request();
    const isValid = response.doctorData !== "";
    return new DoctorValidation(isValid, response.doctorData);
  }
}
