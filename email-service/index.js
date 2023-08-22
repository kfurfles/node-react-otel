const express = require("express");
const nodemailer = require("nodemailer");
const { Kafka } = require("kafkajs");
const axios = require('axios');
const { parseMessage } = require("./helpers");

const app = express();
const port = 5000;

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "seuemail@gmail.com",
    pass: "suasenha",
  },
});

app.use(express.json());

/**
 * Rota para enviar um email.
 * @route POST /send-email
 * @param {Request} req - O objeto de requisição.
 * @param {Response} res - O objeto de resposta.
 * @returns {Response} A resposta da requisição.
 */
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    const mailOptions = {
      from: "seuemail@gmail.com",
      to: to,
      subject: subject,
      text: text,
    };
    return res.status(200).json({ message: "Email enviado com sucesso!", mailOptions });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return res.status(500).json({ error: "Erro ao enviar email" });
  }
});

/**
 * Consulta informações de um CEP no serviço ViaCEP.
 * @param {string} cep - O CEP a ser consultado.
 * @returns {Promise<Object>} Uma Promise contendo os dados do CEP consultado.
 */
async function consultarViaCEP(cep) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar ViaCEP:', error.message);
    throw new Error('Erro ao consultar ViaCEP');
  }
}

/**
 * Processa uma mensagem com tracing.
 * @param {Object} message - A mensagem a ser processada.
 */
async function processMessage(message) {
  const msg = parseMessage(message);  
  // const ctx = propagation.extract(context.active(), msg.headers);
  // const tracer = traceProvider.getTracer('consumer');
  // const span = tracer.startSpan('consumer:message', { context: ctx });

  try {
    await new Promise((resolve) => setTimeout(resolve, 35000));

    // Object.entries(msg).forEach(([key, value]) => {
    //   span.setAttribute(key, value);
    // });
    console.log(`Successful to read message: ${msg.value} at offset of ${msg.offset}`);
  } catch (error) {
    // span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    console.error('Error in processing message:', error);
  } finally {
    // span.end();
  }
}

/**
 * Inicializa o consumidor Kafka.
 */
async function initKafka() {
  await consumer.connect();
  await consumer.subscribe({ topic: "envio-email-boasvindas", fromBeginning: false });

  consumer.run({
    eachMessage: async ({ message }) => {
      processMessage(message);

      consultarViaCEP('01001000')
        .then(data => {
          console.log('Informações do CEP:', data);
        })
        .catch(error => {
          console.error('Erro:', error.message);
        });
    },
  }).then(() => {
    console.log('Kafka Iniciado Email');
  });
}

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  initKafka();
});
