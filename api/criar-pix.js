import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {

    const { total } = req.body;

    const payment = await mercadopago.payment.create({
      transaction_amount: Number(total),
      description: "Pedido Açaí",
      payment_method_id: "pix",
      payer: {
        email: "teste@teste.com"
      }
    });

    res.status(200).json({
      qr_code: payment.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: payment.body.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar PIX" });
  }
}
