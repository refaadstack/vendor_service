import { Sequelize } from 'sequelize';
import Vendor from "../models/VendorModel.js";
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import { validateVendor, validateUpdateVendor } from '../utils/validation.js';

export const getVendors = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'id', 
      sortOrder = 'ASC' 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const validSortFields = ['id', 'name', 'address', 'phone', 'created_at', 'updated_at'];
    const validSortOrders = ['ASC', 'DESC'];

    const orderBy = validSortFields.includes(sortBy) ? sortBy : 'id';
    const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    const whereClause = search ? {
      [Sequelize.Op.or]: [
        { name: { [Sequelize.Op.like]: `%${search}%` } },
        { address: { [Sequelize.Op.like]: `%${search}%` } },
        { phone: { [Sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await Vendor.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [[orderBy, order]]
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    sendSuccessResponse(res, 200, 'Vendors retrieved successfully', {
      vendors: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return sendErrorResponse(res, 400, 'Invalid vendor ID');
    }

    const vendor = await Vendor.findByPk(parseInt(id));

    if (!vendor) {
      return sendErrorResponse(res, 404, 'Vendor not found');
    }

    sendSuccessResponse(res, 200, 'Vendor retrieved successfully', vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const createVendor = async (req, res) => {
  try {
    const { error, value } = validateVendor(req.body);

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      return sendErrorResponse(res, 400, 'Validation error', errors);
    }

    const vendor = await Vendor.create(value);
    sendSuccessResponse(res, 201, 'Vendor created successfully', vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return sendErrorResponse(res, 400, 'Validation error', errors);
    }
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return sendErrorResponse(res, 400, 'Invalid vendor ID');
    }

    const { error, value } = validateUpdateVendor(req.body);

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      return sendErrorResponse(res, 400, 'Validation error', errors);
    }

    const vendor = await Vendor.findByPk(parseInt(id));

    if (!vendor) {
      return sendErrorResponse(res, 404, 'Vendor not found');
    }

    await vendor.update(value);
    sendSuccessResponse(res, 200, 'Vendor updated successfully', vendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return sendErrorResponse(res, 400, 'Validation error', errors);
    }
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return sendErrorResponse(res, 400, 'Invalid vendor ID');
    }

    const vendor = await Vendor.findByPk(parseInt(id));

    if (!vendor) {
      return sendErrorResponse(res, 404, 'Vendor not found');
    }

    await vendor.destroy();
    sendSuccessResponse(res, 200, 'Vendor deleted successfully');
  } catch (error) {
    console.error('Error deleting vendor:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const bulkDeleteVendors = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return sendErrorResponse(res, 400, 'Please provide an array of vendor IDs');
    }

    const numericIds = ids.filter(id => !isNaN(parseInt(id))).map(id => parseInt(id));

    if (numericIds.length === 0) {
      return sendErrorResponse(res, 400, 'No valid vendor IDs provided');
    }

    const deletedCount = await Vendor.destroy({
      where: {
        id: numericIds
      }
    });

    sendSuccessResponse(res, 200, `${deletedCount} vendor(s) deleted successfully`, {
      deletedCount,
      requestedIds: numericIds
    });
  } catch (error) {
    console.error('Error bulk deleting vendors:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};

export const getVendorsStats = async (req, res) => {
  try {
    const totalVendors = await Vendor.count();
    
    sendSuccessResponse(res, 200, 'Statistics retrieved successfully', {
      totalVendors
    });
  } catch (error) {
    console.error('Error fetching vendor statistics:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
};
