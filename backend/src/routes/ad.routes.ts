import express from "express";
import {
  createAd,
  getAds,
  getAdById,
  updateAd,
  deleteAd,
  getAdsByStatus,
  getAdsByBusinessType,
} from "../controllers/ad.controller";

const router = express.Router();

router.post("/", createAd);                  
router.get("/", getAds);                     
router.get("/:id", getAdById);               
router.put("/:id", updateAd);                
router.delete("/:id", deleteAd);             
router.get("/status/:status", getAdsByStatus); 
router.get("/type/:type", getAdsByBusinessType); 

export default router;
