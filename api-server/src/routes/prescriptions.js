import express from "express";
import multer from "multer";
import {
  PrescriptionRepository,
  DoctorRepository,
  DrugDispensingRepository,
} from "../repositories";
import { getIPFromRequest } from "../tools/ip";

const Router = express.Router();

Router.post("/", async (req, res) => {
  try {
    const ip = getIPFromRequest(req);
    const document = req.body.prescriptionFile;
    const reqDoctor = JSON.parse(req.body.doctor);
    const data = req.body;
    reqDoctor.documentId = data.doctorId;
    const doctor = await DoctorRepository.store.getOrCreate(reqDoctor);
    data.digitalSignature = reqDoctor.block;
    data.ip = ip;
    await PrescriptionRepository.store.create(
      doctor,
      document.split(",")[1],
      data
    );
    return res.success();
  } catch (err) {
    return res.error(err);
  }
});

Router.get("/resume", async (req, res) => {
  try {
    const data = await PrescriptionRepository.find.pharmacyResume(
      req.query.hash
    );
    return res.success(data);
  } catch (err) {
    return res.error(err);
  }
});

Router.post("/dispensing", async (req, res) => {
  try {
    const ip = getIPFromRequest(req);
    const { documentId, companyId } = req.body.pharmacist;
    const prescriptionId = req.body.prescriptionId;
    const purchaserDocumentId = req.body.purchaserDocumentId;
    await DrugDispensingRepository.store.create(
      documentId,
      companyId,
      prescriptionId,
      purchaserDocumentId,
      ip
    );
    return res.success();
  } catch (err) {
    return res.error(err);
  }
});

export default Router;
