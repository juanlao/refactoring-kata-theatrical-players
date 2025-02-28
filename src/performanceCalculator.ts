export type Play = {
    name: string;
    type: string;
};
export type Performance = {
    playID: string;
    audience: number;
};
export type PerformanceSummary = {
    customer: string;
    performances: Performance[];
};

export function calculateAmount(play: Play, performance: Performance) {
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

export function calculateTotalAmount(summary: PerformanceSummary, plays: Record<string, Play>) {
    return summary.performances.reduce((accumulatedAmount, performance) => {
        const play = plays[performance.playID];
        return accumulatedAmount + calculateAmount(play, performance);
    }, 0)
}

function calculateCreditsFor(play: Play, perf: Performance) {
    const baseCredits = Math.max(perf.audience - 30, 0);
    const extraCreditsForComedyAttendees = Math.floor(perf.audience / 5);
    return ("comedy" === play.type)
        ? baseCredits + extraCreditsForComedyAttendees
        : baseCredits;
}

export function calculateTotalCredits(summary: PerformanceSummary, plays: Record<string, Play>) {
    return summary.performances.reduce((accumulatedCredits, performance) => {
        const play = plays[performance.playID];
        return accumulatedCredits + calculateCreditsFor(play, performance);
    }, 0)
}