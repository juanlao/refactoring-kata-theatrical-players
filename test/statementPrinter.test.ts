import { statementPrinter } from "../src/statementPrinter";

test("generates a detailed statement for a given performance summary with mixed play types", () => {
  //arrange
  const aSummary = createAnPerformanceSummary();
  //act
  const plays = createAnExamplePlays();
  //assert
  expect(statementPrinter(aSummary, plays)).toEqual(`Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`);
});

test("does not allow an performance summary with unknown play types", () => {
  //arrange
  const invoice = createAnotherPerformanceSummary();
  //act
  const plays = createAnotherExamplePlays();
  //assert
  expect(() => statementPrinter(invoice, plays)).toThrow(/unknown type/);
});

function createAnPerformanceSummary() {
  return {
    customer: "BigCo",
      performances: [
        {
          playID: "hamlet",
          audience: 55
        },
        {
          playID: "as-like",
          audience: 35
        },
        {
          playID: "othello",
          audience: 40
        }
      ]
    };
}

function createAnExamplePlays() {
  return {
    hamlet: { name: "Hamlet", type: "tragedy" },
    "as-like": { name: "As You Like It", type: "comedy" },
    othello: { name: "Othello", type: "tragedy" }
  };
}

function createAnotherPerformanceSummary() {
  return {
    customer: "BigCoII",
    performances: [
      {
        playID: "henry-v",
        audience: 53
      },
      {
        playID: "as-like",
        audience: 55
      }
    ]
  };
}

function createAnotherExamplePlays() {
  return {
    "henry-v": { name: "Henry V", type: "history" },
    "as-like": { name: "As You Like It", type: "pastoral" }
  };
}
