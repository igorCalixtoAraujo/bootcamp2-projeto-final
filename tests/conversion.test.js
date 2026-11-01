const { calculateConversion } = require("../script");

describe("Conversão de moedas", () => {
    test("Deve converter um valor corretamente", () => {
        expect(calculateConversion(10, 5)).toBe(50);
    });

    test("Deve trabalhar com valores decimais", () => {
        expect(calculateConversion(10.5, 5)).toBe(52.5);
    });

    test("Deve rejeitar valores negativos", () => {
        expect(() => calculateConversion(-10, 5)).toThrow();
    });

    test("Deve rejeitar cotações iguais a zero", () => {
        expect(() => calculateConversion(10, 0)).toThrow();
    });
});