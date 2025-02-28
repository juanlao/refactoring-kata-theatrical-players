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
  return renderStatementAsPlainText(summary, plays);
}

type Statement={
 readonly customer: string;
 readonly performances: PerformanceRow[];
 readonly totalAmountInUSD: string;
 readonly totalCredits: number;
}

type PerformanceRow = {
 readonly playName:string;
 readonly audience: number;
 readonly amountInUsd: string;
}
function renderStatementAsPlainText(summary: PerformanceSummary, plays: Record<string, Play>) {
  let result = `Statement for ${summary.customer}\n`;

  for (let perf of summary.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);
    result += ` ${play.name}: ${(formatAsUSD(thisAmount))} (${perf.audience} seats)\n`;
  }

  let totalAmount = calculateTotalAmount(summary, plays);
  result += `Amount owed is ${formatAsUSD(totalAmount)}\n`;
  result += `You earned ${(calculateTotalCredits(summary, plays))} credits\n`;
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


