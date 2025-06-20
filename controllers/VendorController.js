import Vendor from "../models/VendorModel.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVendor = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const vendor = await Vendor.create({ name: name, address: address, phone: phone });
    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    await vendor.update(req.body);
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    await vendor.destroy();
    res.json({ message: "Vendor deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
