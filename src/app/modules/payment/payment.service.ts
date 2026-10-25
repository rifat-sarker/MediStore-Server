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
  const store_id = (config.ssl_store_id || process.env.SSL_STORE_ID || "medis6adcdc8ccb2d9") as string;
  const store_passwd = (config.ssl_store_passwd || process.env.SSL_STORE_PASSWD || "19n0siXbnHhU") as string;
  const is_live = Boolean(config.ssl_is_live);

  const backendUrl =
    config.backend_url ||
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://medistore-server-li88.onrender.com"
      : "http://localhost:5001");
  const apiUrl = is_live
    ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
    : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

  const params = new URLSearchParams();
  params.append("store_id", store_id);
  params.append("store_passwd", store_passwd);
  params.append("total_amount", Number(amount).toFixed(2));
  params.append("currency", "BDT");
  params.append("tran_id", transactionId);
  params.append("success_url", `${backendUrl}/api/v1/payment/success?tran_id=${transactionId}`);
  params.append("fail_url", `${backendUrl}/api/v1/payment/fail?tran_id=${transactionId}`);
  params.append("cancel_url", `${backendUrl}/api/v1/payment/cancel?tran_id=${transactionId}`);
  params.append("ipn_url", `${backendUrl}/api/v1/payment/ipn`);
  params.append("shipping_method", "Courier");
  params.append("product_name", "MediStore Prescription & OTC Medicines");
  params.append("product_category", "Healthcare");
  params.append("product_profile", "general");
  params.append("cus_name", customerName || "MediStore Customer");
  params.append("cus_email", customerEmail || "customer@medistore.com");
  params.append("cus_add1", customerAddress || "Dhaka, Bangladesh");
  params.append("cus_city", "Dhaka");
  params.append("cus_postcode", "1200");
  params.append("cus_country", "Bangladesh");
  params.append("cus_phone", customerPhone || "01700000000");
  params.append("ship_name", customerName || "MediStore Customer");
  params.append("ship_add1", shippingAddress || customerAddress || "Dhaka, Bangladesh");
  params.append("ship_city", "Dhaka");
  params.append("ship_postcode", "1200");
  params.append("ship_country", "Bangladesh");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const result = await response.json();
  return result;
};

export const validateSSLPayment = async (val_id: string) => {
  const store_id = (config.ssl_store_id || process.env.SSL_STORE_ID || "medis6adcdc8ccb2d9") as string;
  const store_passwd = (config.ssl_store_passwd || process.env.SSL_STORE_PASSWD || "19n0siXbnHhU") as string;
  const is_live = Boolean(config.ssl_is_live);

  const baseUrl = is_live
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";

  const validationUrl = `${baseUrl}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(
    val_id
  )}&store_id=${encodeURIComponent(store_id)}&store_passwd=${encodeURIComponent(
    store_passwd
  )}&v=1&format=json`;

  const response = await fetch(validationUrl);
  return await response.json();
};

