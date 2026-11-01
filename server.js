const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota inicial para verificar se o servidor está funcionando
app.get("/", (req, res) => {
    res.json({ message: "API do conversor funcionando!" });
});

// Lista de moedas disponíveis
app.get("/api/currencies", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.frankfurter.dev/v1/currencies"
        );

        res.json(response.data);
    } catch (error) {
        res.status(502).json({ error: "Erro ao consultar moedas." });
    }
});

// Consulta a cotação entre duas moedas
app.get("/api/rate", async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({
            error: "Informe as moedas de origem e destino."
        });
    }

    const origem = from.toUpperCase();
    const destino = to.toUpperCase();

    if (origem === destino) {
        return res.json({ from: origem, to: destino, rate: 1 });
    }

    try {
        const response = await axios.get(
            "https://api.frankfurter.dev/v1/latest",
            {
                params: {
                    base: origem,
                    symbols: destino
                }
            }
        );

        const rate = response.data.rates[destino];

        if (!rate) {
            return res.status(404).json({
                error: "Cotação não encontrada."
            });
        }

        res.json({
            from: origem,
            to: destino,
            rate,
            date: response.data.date
        });

    } catch (error) {
        res.status(502).json({
            error: "Não foi possível consultar a cotação."
        });
    }
});

// Realiza a conversão de moedas
app.post("/api/convert", async (req, res) => {
    const { amount, from, to } = req.body;

    if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        !from ||
        !to
    ) {
        return res.status(400).json({
            error: "Informe um valor válido e as moedas de origem e destino."
        });
    }

    const origem = from.toUpperCase();
    const destino = to.toUpperCase();

    if (origem === destino) {
        return res.json({
            amount,
            from: origem,
            to: destino,
            rate: 1,
            result: Number(amount.toFixed(2))
        });
    }

    try {
        const response = await axios.get(
            "https://api.frankfurter.dev/v1/latest",
            {
                params: {
                    base: origem,
                    symbols: destino
                }
            }
        );

        const rate = response.data.rates[destino];

        if (!rate) {
            return res.status(404).json({
                error: "Cotação não encontrada."
            });
        }

        res.json({
            amount,
            from: origem,
            to: destino,
            rate,
            result: Number((amount * rate).toFixed(2)),
            date: response.data.date
        });

    } catch (error) {
        res.status(502).json({
            error: "Não foi possível realizar a conversão."
        });
    }
});

// Inicia o servidor
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = app;