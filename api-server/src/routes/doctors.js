import express from "express";
import { DoctorRepository } from "../repositories";

const Router = express.Router();

Router.post("/validate", async (req, res) => {
  const { country, name, id } = req.body.doctor;
  try {
    const result = await DoctorRepository.validate.nationalId(country, {
      name,
      id,
    });
    if (result.valid) {
      await DoctorRepository.store.validateData(
        id,
        result.validations.map((r) => r.results.data)
      );
      return res.success({
        isValid: true,
        validations: result.validations,
      });
    }
    return res.fail(
      {
        isValid: false,
      },
      403
    );
  } catch (err) {
    if (country != "BR") 
      return res.success({ isValid: true, validations: [] });
    return res.error(err);
  }
});

export default Router;
