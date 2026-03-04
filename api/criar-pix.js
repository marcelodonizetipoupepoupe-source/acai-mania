export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const TOKEN = process.env.MP_ACCESS_TOKEN;

  if (!TOKEN) {
    return res.status(500).json({ error: "Token não configurado" });
  }

  try {

    const { total } = req.body;

    const response = await fetch(
      "https://api.mercadopago.com/v1/payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          transaction_amount: Number(total),
          description: "Pedido Açaí",
          payment_method_id: "pix",
          payer: { email: "cliente@email.com" }
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Erro ao gerar PIX" });
  }
}