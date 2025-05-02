const TransferReceipt = require('../models/TransferReceipt');
const Warehouse = require('../models/Warehouse');
const GroupOrder = require('../models/GroupOrder');

// @desc    Create new transfer receipt
// @route   POST /api/transferreceipts
// @access  Private/Admin
exports.createTransferReceipt = async (req, res, next) => {
  try {
    // Check if warehouses exist
    const fromWarehouse = await Warehouse.findById(req.body.from_warehouse);
    if (!fromWarehouse) {
      return res.status(404).json({
        success: false,
        message: 'From warehouse not found'
      });
    }

    const toWarehouse = await Warehouse.findById(req.body.to_warehouse);
    if (!toWarehouse) {
      return res.status(404).json({
        success: false,
        message: 'To warehouse not found'
      });
    }

    // Check if group order exists
    const groupOrder = await GroupOrder.findById(req.body.group_order);
    if (!groupOrder) {
      return res.status(404).json({
        success: false,
        message: 'Group order not found'
      });
    }

    const transferReceipt = await TransferReceipt.create(req.body);

    res.status(201).json({
      success: true,
      data: transferReceipt
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all transfer receipts
// @route   GET /api/transferreceipts
// @access  Private/Admin
exports.getTransferReceipts = async (req, res, next) => {
  try {
    const transferReceipts = await TransferReceipt.find()
      .populate({
        path: 'from_warehouse',
        select: 'warehouse_id location'
      })
      .populate({
        path: 'to_warehouse',
        select: 'warehouse_id location'
      })
      .populate({
        path: 'group_order',
        select: 'grouporder_id province district'
      });

    res.status(200).json({
      success: true,
      count: transferReceipts.length,
      data: transferReceipts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single transfer receipt
// @route   GET /api/transferreceipts/:id
// @access  Private/Admin
exports.getTransferReceipt = async (req, res, next) => {
  try {
    const transferReceipt = await TransferReceipt.findById(req.params.id)
      .populate({
        path: 'from_warehouse',
        select: 'warehouse_id location'
      })
      .populate({
        path: 'to_warehouse',
        select: 'warehouse_id location'
      })
      .populate({
        path: 'group_order',
        select: 'grouporder_id province district'
      });

    if (!transferReceipt) {
      return res.status(404).json({
        success: false,
        message: 'Transfer receipt not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transferReceipt
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update transfer receipt
// @route   PUT /api/transferreceipts/:id
// @access  Private/Admin
exports.updateTransferReceipt = async (req, res, next) => {
  try {
    let transferReceipt = await TransferReceipt.findById(req.params.id);

    if (!transferReceipt) {
      return res.status(404).json({
        success: false,
        message: 'Transfer receipt not found'
      });
    }

    // Check if warehouses exist
    if (req.body.from_warehouse) {
      const fromWarehouse = await Warehouse.findById(req.body.from_warehouse);
      if (!fromWarehouse) {
        return res.status(404).json({
          success: false,
          message: 'From warehouse not found'
        });
      }
    }

    if (req.body.to_warehouse) {
      const toWarehouse = await Warehouse.findById(req.body.to_warehouse);
      if (!toWarehouse) {
        return res.status(404).json({
          success: false,
          message: 'To warehouse not found'
        });
      }
    }

    // Check if group order exists
    if (req.body.group_order) {
      const groupOrder = await GroupOrder.findById(req.body.group_order);
      if (!groupOrder) {
        return res.status(404).json({
          success: false,
          message: 'Group order not found'
        });
      }
    }

    transferReceipt = await TransferReceipt.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: transferReceipt
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete transfer receipt
// @route   DELETE /api/transferreceipts/:id
// @access  Private/Admin
exports.deleteTransferReceipt = async (req, res, next) => {
  try {
    const transferReceipt = await TransferReceipt.findById(req.params.id);

    if (!transferReceipt) {
      return res.status(404).json({
        success: false,
        message: 'Transfer receipt not found'
      });
    }

    await transferReceipt.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 