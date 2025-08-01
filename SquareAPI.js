const { Client, Environment } = require('square');

// const squareClient = new Client({
//   environment: Environment.Sandbox, // Change to Environment.Production for live
//   accessToken: process.env.SQUARE_ACCESS_TOKEN, // Use .env for security
// });

// const paymentsApi = squareClient.paymentsApi;

const processPayment = async (req, res) => {
  const { nonce, amount, currency, taskId, userId } = req.body;

//   try {
//     const response = await paymentsApi.createPayment({
//       sourceId: nonce,
//       idempotencyKey: `${userId}-${taskId}-${Date.now()}`,
//       amountMoney: {
//         amount: amount, // in cents
//         currency: currency || 'USD',
//       },
//     });

//     res.status(200).json({
//       success: true,
//       transactionId: response.result.payment.id,
//     });
//   } catch (error) {
//     console.error('Payment failed:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
};

module.exports = { processPayment };