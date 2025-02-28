type Play = {
  name: string;
  type: string;
};

type Performance = {
  playID: string;
  audience: number;
};

type PerformanceSummary = {
  customer: string;
  performances: Performance[];
};

export function statement(summary: PerformanceSummary, plays: Record<string, Play>) {
  const statement:Statement = createStatement(summary, plays);
  return renderStatementAsPlainText(statement);
}

type Statement={
 readonly customer: string;
 readonly performances: PerformanceRow[];
 readonly totalAmountInUSD: string;
 readonly totalCredits: number;
}

function createStatement(summary: PerformanceSummary, plays: Record<string, Play>): Statement{
  let totalAmount = calculateTotalAmount(summary, plays);

  return {
    customer: summary.customer,
    performances: summary.performances.map(p=>createPerformanceRow(p, plays)),
    totalAmountInUSD: formatAsUSD(totalAmount),
    totalCredits: calculateTotalCredits(summary, plays)

  }
}

type PerformanceRow = {
 readonly playName:string;
 readonly audience: number;
 readonly amountInUsd: string;
}

function createPerformanceRow(performance: Performance, plays: Record<string, Play>): PerformanceRow {
  const play = plays[performance.playID];
  let amount = calculateAmount(play, performance);
  return {
    amountInUsd: formatAsUSD(amount),
    audience: performance.audience,
    playName: play.name

  }
}

function renderStatementAsPlainText(statement: Statement) {
  let result = `Statement for ${statement.customer}\n`;

  for (let performance of statement.performances) {
    result += ` ${performance.playName}: ${performance.amountInUsd} (${performance.audience} seats)\n`;
  }

  result += `Amount owed is ${statement.totalAmountInUSD}\n`;
  result += `You earned ${statement.totalCredits} credits\n`;
  return result;
}

function calculateAmount(play: Play, performance: Performance) {
  let totalAmount = 0;
  switch (play.type) {
    case "tragedy":
      totalAmount = 40000;
      if (performance.audience > 30) {
        totalAmount += 1000 * (performance.audience - 30);
      }
      break;
    case "comedy":
      totalAmount = 30000;
      if (performance.audience > 20) {
        totalAmount += 10000 + 500 * (performance.audience - 20);
      }
      totalAmount += 300 * performance.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return totalAmount;
}

function calculateTotalAmount(summary: PerformanceSummary, plays: Record<string, Play>) {
  return summary.performances.reduce((accumulatedAmount, performance)=>{
    const play = plays[performance.playID];
    return accumulatedAmount + calculateAmount(play, performance);
  },0)
}

function calculateCreditsFor(play: Play, perf: Performance) {
  const baseCredits =Math.max(perf.audience - 30, 0);
  const extraCreditsForComedyAttendees = Math.floor(perf.audience / 5);
  return ("comedy" === play.type)
      ? baseCredits + extraCreditsForComedyAttendees
      : baseCredits;
}

function formatAsUSD(thisAmount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(thisAmount / 100);
}

function calculateTotalCredits(summary: PerformanceSummary, plays: Record<string, Play>) {
  return summary.performances.reduce((accumulatedCredits, performance) => {
    const play = plays[performance.playID];
    return accumulatedCredits + calculateCreditsFor(play, performance);
  }, 0)
}


