import { Schema, Types, model } from "mongoose";
import { IOrder } from "./order.interface";
import Medicine from "../medicine/medicine.model";


const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "Online",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate total, discount, delivery charge, and final price
orderSchema.pre("validate", async function (next) {
  const order = this;

  // Step 1: Initialize total amount
  let totalAmount = 0;
  let finalDiscount = 0;

  // Step 2: Calculate total amount for products
  for (let item of order.products) {
    const product = await Medicine.findById(item.product);

    if (!product) {
      return next(new Error(`Product not found!.`));
    }

    const offerPrice = (await product?.calculateOfferPrice()) || 0;

    let productPrice = product.price;
    if (offerPrice) productPrice = Number(offerPrice);

    item.unitPrice = productPrice;
    const price = productPrice * item.quantity;
    console.log(price);
    totalAmount += price;
  }


  const isDhaka = order?.shippingAddress?.toLowerCase()?.includes("dhaka");
  const deliveryCharge = isDhaka ? 70 : 120;

  order.totalAmount = totalAmount;
  order.discount = finalDiscount;
  order.deliveryCharge = deliveryCharge;
  order.finalAmount = totalAmount - finalDiscount + deliveryCharge;

  next();
});

export const Order = model<IOrder>("Order", orderSchema);
