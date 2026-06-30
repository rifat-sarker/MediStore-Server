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
  const store_id = config.ssl_store_id as string;
  const store_passwd = config.ssl_store_passwd as string;
  const is_live = config.ssl_is_live;

  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${config.frontend_url}/payment/success?tran_id=${transactionId}`,
    fail_url: `${config.frontend_url}/payment/fail?tran_id=${transactionId}`,
    cancel_url: `${config.frontend_url}/payment/cancel?tran_id=${transactionId}`,
    ipn_url: `${process.env.BACKEND_URL || "http://localhost:5001"}/api/v1/payment/ipn`,
    shipping_method: "Courier",
    product_name: "Medicines",
    product_category: "Healthcare",
    product_profile: "general",
    cus_name: customerName,
    cus_email: customerEmail,
    cus_add1: customerAddress,
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: customerPhone,
    ship_name: customerName,
    ship_add1: shippingAddress,
    ship_city: "Dhaka",
    ship_country: "Bangladesh",
  };

  const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const response = await sslcommerz.init(data);
  return response;
};
