import {PerformanceSummary, Play} from "./performanceCalculator";
import {createStatement, Statement} from "./statement";

export function statementPrinter(summary: PerformanceSummary, plays: Record<string, Play>) {
  const statement:Statement = createStatement(summary, plays);
  return printStatementAsPlainText(statement);
}

function printStatementAsPlainText(statement: Statement) {
  let result = `Statement for ${statement.customer}\n`;

  for (let performance of statement.performances) {
    result += ` ${performance.playName}: ${performance.amountInUsd} (${performance.audience} seats)\n`;
  }

  result += `Amount owed is ${statement.totalAmountInUSD}\n`;
  result += `You earned ${statement.totalCredits} credits\n`;
  return result;
}


