import { SquareClient } from 'square';

const isSandbox = process.env.NODE_ENV !== 'production';

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: isSandbox
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com',
    timeout: 10000,
});
const processPayment = async (req, res) => {
  const { nonce, amount, currency = 'USD', taskId, userId } = req.body;
  console.log('Processing payment:', { nonce, amount, currency, taskId, userId });
  try {
    const response = await client.payments.create({
      sourceId: nonce,
      idempotencyKey: `${userId}-${taskId}-${Date.now()}`,
      amountMoney: {
        amount: BigInt(amount), // amount in cents
        currency,
      },
      autocomplete: true,
      note: `Payment for task ${taskId}`,
    });
    console.log('Payment response:', response);
    return res.status(200).json({
      success: true,
      transactionId: response.payment.id,
    });
  } catch (error) {
    console.error('Payment failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export default { processPayment };