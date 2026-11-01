jest.mock("../supabase", () => ({
    from: jest.fn(() => ({
        insert: jest.fn().mockResolvedValue({ error: null })
    }))
}));

jest.mock("axios");

const request = require("supertest");
const app = require("../server");

describe("Testes da API", () => {

    test("GET / deve confirmar que a API está funcionando", async () => {
        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("API do conversor funcionando!");
    });

    test("POST /api/convert deve rejeitar dados inválidos", async () => {
        const response = await request(app)
            .post("/api/convert")
            .send({
                amount: "abc",
                from: "BRL",
                to: "USD"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    test("POST /api/convert deve converter moedas iguais", async () => {
        const response = await request(app)
            .post("/api/convert")
            .send({
                amount: 100,
                from: "BRL",
                to: "BRL"
            });

        expect(response.status).toBe(200);
        expect(response.body.result).toBe(100);
        expect(response.body.rate).toBe(1);
    });

});