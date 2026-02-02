import type { Response } from "express";
import type { AuthRequest } from "../../shared/middleware/auth.middleware.js";
import { orderService } from "./order.service.js";

export const orderController = {
  async getSellerOrders(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const status = req.query.status as string;

      const targetSellerId = isAdmin && req.query.sellerId
        ? (req.query.sellerId as string)
        : sellerId;

      if (!targetSellerId) {
        return res.status(400).json({ success: false, message: "Seller ID is required" });
      }

      const result = await orderService.getSellerOrders({
        sellerId: targetSellerId,
        page,
        limit,
        status,
      });

      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch seller orders" });
    }
  },

  async getSellerOrderById(req: AuthRequest, res: Response) {
    try {
      const orderId = String(req.params.id);
      const sellerId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      if (!sellerId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const result = await orderService.getSellerOrderById(orderId, sellerId, isAdmin);

      if (!result) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      if (result.sellerItems.length === 0) {
        return res.status(403).json({
          success: false,
          message: "No items from this seller in this order",
        });
      }

      res.json({ success: true, data: result.order });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
  },

  async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const status = req.query.status as string;

      const params: { page: number; limit: number; status?: string; customerId?: string } = { page, limit };
      if (status) params.status = status;

      if (isAdmin && req.query.customerId) {
        params.customerId = req.query.customerId as string;
      } else if (!isAdmin && userId) {
        params.customerId = userId;
      }

      const result = await orderService.getAll(params);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const userId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      const order = await orderService.getById(id);

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      if (!isAdmin && order.customerId !== userId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const {
        shippingName,
        shippingPhone,
        shippingEmail,
        address,
        paymentMethod = "cod",
        items,
      } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      if (!shippingName || !shippingPhone || !shippingEmail || !address) {
        return res.status(400).json({
          success: false,
          message: "Shipping name, phone, email, and address are required",
        });
      }

      const validPaymentMethods = ["cod"];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(", ")}`,
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: "Order items are required" });
      }

      const order = await orderService.create({
        customerId: userId,
        shippingName,
        shippingPhone,
        shippingEmail,
        address,
        paymentMethod,
        items,
      });

      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || "Failed to create order" });
    }
  },

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const sellerId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      const validStatuses = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const order = await orderService.getById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      if (!isAdmin && sellerId) {
        const hasSellerItems = await orderService.hasSellerItems(id, sellerId);
        if (!hasSellerItems) {
          return res.status(403).json({ success: false, message: "Access denied" });
        }
      }

      const updatedOrder = await orderService.updateStatus(id, status);
      res.json({ success: true, data: updatedOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update order status" });
    }
  },

  async updatePaymentStatus(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const { paymentStatus } = req.body;

      const validPaymentStatuses = ["pending", "paid"];
      if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(", ")}`,
        });
      }

      const order = await orderService.getById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const updatedOrder = await orderService.updatePaymentStatus(id, paymentStatus);
      res.json({ success: true, data: updatedOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update payment status" });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const userId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      const order = await orderService.getById(id);

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      if (!isAdmin) {
        if (order.customerId !== userId) {
          return res.status(403).json({ success: false, message: "Access denied" });
        }
        if (order.status !== "placed") {
          return res.status(400).json({
            success: false,
            message: "Can only cancel orders with 'placed' status",
          });
        }
      }

      await orderService.delete(id);
      res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete order" });
    }
  },
};
