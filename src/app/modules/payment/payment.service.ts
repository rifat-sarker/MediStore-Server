// @ts-ignore
import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../config";
import { v4 as uuidv4 } from "uuid";

export const initiateSSLCommerzPayment = async ({
  amount,
  transactionId,
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  shippingAddress,
}: {
  amount: number;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  shippingAddress: string;
}) => {
  const store_id = (config.ssl_store_id || "testbox") as string;
  const store_passwd = (config.ssl_store_passwd || "qwerty") as string;
  const is_live = Boolean(config.ssl_is_live);

  const backendUrl = process.env.BACKEND_URL || "http://localhost:5001";
  const frontendUrl = config.frontend_url || "http://localhost:3000";

  const data = {
    total_amount: Number(amount).toFixed(2),
    currency: "BDT",
    tran_id: transactionId,
    // SSLCommerz redirects via POST with payment details in body to success/fail/cancel URLs
    success_url: `${backendUrl}/api/v1/payment/success?tran_id=${transactionId}`,
    fail_url: `${backendUrl}/api/v1/payment/fail?tran_id=${transactionId}`,
    cancel_url: `${backendUrl}/api/v1/payment/cancel?tran_id=${transactionId}`,
    ipn_url: `${backendUrl}/api/v1/payment/ipn`,
    shipping_method: "Courier",
    product_name: "MediStore Prescription & OTC Medicines",
    product_category: "Healthcare",
    product_profile: "general",
    cus_name: customerName || "MediStore Customer",
    cus_email: customerEmail || "customer@medistore.com",
    cus_add1: customerAddress || "Dhaka, Bangladesh",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: customerPhone || "01700000000",
    ship_name: customerName || "MediStore Customer",
    ship_add1: shippingAddress || customerAddress || "Dhaka, Bangladesh",
    ship_city: "Dhaka",
    ship_country: "Bangladesh",
  };

  const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const response = await sslcommerz.init(data);
  return response;
};

export const validateSSLPayment = async (val_id: string) => {
  const store_id = (config.ssl_store_id || "testbox") as string;
  const store_passwd = (config.ssl_store_passwd || "qwerty") as string;
  const is_live = Boolean(config.ssl_is_live);

  const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const response = await sslcommerz.validate({ val_id });
  return response;
};
