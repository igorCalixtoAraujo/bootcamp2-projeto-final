
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const supabase = require("./supabase");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota inicial
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
        console.error(error);
        res.status(502).json({
            error: "Erro ao consultar moedas."
        });
    }
});

// Consulta a cotação entre duas moedas
app.get("/api/rate", async (req, res) => {
    const { from, to } = req.query;

    if (
        typeof from !== "string" ||
        typeof to !== "string" ||
        !from.trim() ||
        !to.trim()
    ) {
        return res.status(400).json({
            error: "Informe as moedas de origem e destino."
        });
    }

    const origem = from.toUpperCase();
    const destino = to.toUpperCase();

    if (origem === destino) {
        return res.json({
            from: origem,
            to: destino,
            rate: 1
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
            from: origem,
            to: destino,
            rate,
            date: response.data.date
        });

    } catch (error) {
        console.error(error);
        res.status(502).json({
            error: "Não foi possível consultar a cotação."
        });
    }
});

// Realiza a conversão de moedas e salva no Supabase
app.post("/api/convert", async (req, res) => {
    const { amount, from, to } = req.body;

    if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        typeof from !== "string" ||
        typeof to !== "string" ||
        !from.trim() ||
        !to.trim()
    ) {
        return res.status(400).json({
            error: "Informe um valor válido e as moedas de origem e destino."
        });
    }

    const origem = from.toUpperCase();
    const destino = to.toUpperCase();

    try {
        let rate = 1;
        let date = new Date().toISOString().slice(0, 10);

        // Consulta a API somente se as moedas forem diferentes
        if (origem !== destino) {
            const response = await axios.get(
                "https://api.frankfurter.dev/v1/latest",
                {
                    params: {
                        base: origem,
                        symbols: destino
                    }
                }
            );

            rate = response.data.rates[destino];
            date = response.data.date;

            if (!rate) {
                return res.status(404).json({
                    error: "Cotação não encontrada."
                });
            }
        }

        // Calcula o resultado
        const result = Number((amount * rate).toFixed(2));

        // Salva a conversão no Supabase
        const { error } = await supabase
            .from("conversion_history")
            .insert({
                amount,
                from_currency: origem,
                to_currency: destino,
                exchange_rate: rate,
                converted_amount: result
            });

        if (error) {
            console.error(error);
            return res.status(500).json({
                error: "Conversão realizada, mas não foi possível salvar no histórico."
            });
        }

        // Retorna o resultado
        res.json({
            amount,
            from: origem,
            to: destino,
            rate,
            result,
            date
        });

    } catch (error) {
        console.error(error);
        res.status(502).json({
            error: "Não foi possível realizar a conversão."
        });
    }
});

// Consulta o histórico de conversões
app.get("/api/history", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("conversion_history")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return res.status(500).json({
                error: "Não foi possível consultar o histórico."
            });
        }

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Erro ao consultar o histórico."
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
