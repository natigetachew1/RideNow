import { Request, Response } from "express";
import { Ad } from "../model/ad";

// Create a new ad
export const createAd = async (req: Request, res: Response) => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json(ad);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

//  Get all ads
export const getAds = async (req: Request, res: Response) => {
  try {
    const ads = await Ad.find().populate("userId vehicleId");
    res.status(200).json(ads);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  Get single ad by ID
export const getAdById = async (req: Request, res: Response) => {
  try {
    const ad = await Ad.findById(req.params.id).populate("userId vehicleId");
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.status(200).json(ad);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  Update an ad
export const updateAd = async (req: Request, res: Response) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.status(200).json(ad);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

//  Delete an ad
export const deleteAd = async (req: Request, res: Response) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  Get ads by status (active/inactive)
export const getAdsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const ads = await Ad.find({ status });
    res.status(200).json(ads);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  Get ads by business type (rent/delivery)
export const getAdsByBusinessType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const ads = await Ad.find({ businessType: type });
    res.status(200).json(ads);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
