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

    if (!total) {
      return res.status(400).json({ error: "Valor não enviado" });
    }

    const payment = await mercadopago.payment.create({
      transaction_amount: Number(total),
      description: "Pedido Açai Mania",
      payment_method_id: "pix",
      payer: {
        email: "cliente@acai.com"
      }
    });

    const dados = payment.body.point_of_interaction.transaction_data;

    res.status(200).json({
      qr_code: dados.qr_code,
      qr_code_base64: dados.qr_code_base64
    });

  } catch (error) {

    console.error("ERRO MP:", error);

    res.status(500).json({
      error: "Erro ao gerar PIX",
      detalhe: error.message
    });
  }
}
