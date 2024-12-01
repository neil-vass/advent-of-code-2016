import * as ohm from "ohm-js"

const arithmetic = ohm.grammar(`
  Arithmetic {
    Exp = AddExp

    AddExp = AddExp "+" MulExp  -- plus
           | AddExp "-" MulExp  -- minus
           | MulExp

    MulExp = MulExp "*" number  -- times
           | MulExp "/" number  -- div
           | number

    number = digit+
  }
    `);


const semantics = arithmetic.createSemantics();
semantics.addOperation("eval", {
    AddExp_plus(a, _, b) {
        return a.eval() + b.eval();
    },
    AddExp_minus(a, _, b) {
        return a.eval() - b.eval();
    },
    MulExp_times(a, _, b) {
        return a.eval() * b.eval();
    },
    MulExp_div(a, _, b) {
        return a.eval() / b.eval();
    },
    number(digits) {
        return parseInt(digits.sourceString);
    }
});

console.log([
    semantics(arithmetic.match('100 + 1 * 2')).eval(),
    semantics(arithmetic.match('1 + 2 - 3 + 4')).eval(),
    semantics(arithmetic.match('1 + 10 * 5')).eval()
])