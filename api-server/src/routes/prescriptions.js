import express from "express";
import multer from "multer";
import { PrescriptionRepository, DoctorRepository } from "../repositories";

const Router = express.Router();
const upload = multer({ dest: "uploads/" });

Router.post("/", upload.single("prescriptionFile"), async (req, res) => {
  try {
    const doctor = await DoctorRepository.store.getOrCreate(req.body.doctor);
    await PrescriptionRepository.store.create(doctor, req.body);
    return res.success();
  } catch (err) {
    return res.error(err);
  }
});

export default Router;
