enum PlayType{
    Tragedy= "tragedy",
    Comedy ="comedy"
}

export type Play = {
    name: string;
    type: PlayType;
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
    const isUnknownPlayType = !Object.values(PlayType).includes(play.type);
    if(isUnknownPlayType) {
        throw new Error(`unknown type: ${play.type}`);
    }
    let totalAmount = 0;
    switch (play.type) {
        case PlayType.Tragedy:
            totalAmount = 40000;
            if (performance.audience > 30) {
                totalAmount += 1000 * (performance.audience - 30);
            }
            return totalAmount;
        case PlayType.Comedy:
            totalAmount = 30000;
            if (performance.audience > 20) {
                totalAmount += 10000 + 500 * (performance.audience - 20);
            }
            totalAmount += 300 * performance.audience;
            return totalAmount;
    }
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
    return (PlayType.Comedy === play.type)
        ? baseCredits + extraCreditsForComedyAttendees
        : baseCredits;
}

export function calculateTotalCredits(summary: PerformanceSummary, plays: Record<string, Play>) {
    return summary.performances.reduce((accumulatedCredits, performance) => {
        const play = plays[performance.playID];
        return accumulatedCredits + calculateCreditsFor(play, performance);
    }, 0)
}