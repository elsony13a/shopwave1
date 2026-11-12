import express from 'express';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const router = express.Router();

const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const dynamoDb = DynamoDBDocumentClient.from(ddbClient);
const sesClient = new SESClient({ region: "us-east-1" });

// دالة إنشاء الأوردر
async function createOrder(req, res) {
  try {
    const orderData = req.body;
    const orderId = "ORD-" + Date.now();

    const newOrder = {
      orderId: orderId,
      createdAt: new Date().toISOString(),
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      customerDetails: orderData.customerDetails,
    };

    // 1. حفظ الأوردر في DynamoDB
    await dynamoDb.send(
      new PutCommand({
        TableName: "OrdersTable",
        Item: newOrder,
      })
    );

    // 2. إرسال إيميل عبر SES بعد نجاح الحفظ
    await sendOrderEmail(newOrder);

    return res.status(201).json({ success: true, orderId, message: "Order created successfully!" });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
}

async function sendOrderEmail(order) {
  const params = {
    Source: "ebrahimsayed836@gmail.com",
    Destination: {
      ToAddresses: [order.customerDetails.email, "ebrahimsayed836@gmail.com"],
    },
    Message: {
      Subject: {
        Data: `طلب جديد تم إنشاؤه بنجاح! #${order.orderId}`,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
            <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px; background-color: #f9f9f9;">
              <h2 style="color: #2b6cb0;">متجر ShopWave - تفاصيل الطلب الجديد</h2>
              <p>مرحباً، تم استلام طلبك بنجاح وجاري تجهيزه.</p>
              <h3>رقم الطلب: ${order.orderId}</h3>
              <p><strong>المبلغ الإجمالي:</strong> $${order.totalAmount}</p>
              <hr/>
              <p style="color: #718096; font-size: 12px;">شكراً لتسوقك معنا!</p>
            </div>
          `,
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    console.log("Email sent successfully via SES!");
  } catch (err) {
    console.error("Failed to send email via SES:", err);
  }
}

// ربط الـ Route الأساسي (POST /api/orders) بالدالة
router.post('/', createOrder);

// تصدير الـ Router بالاسم اللي app.js مستنيه
export { router as ordersRouter };