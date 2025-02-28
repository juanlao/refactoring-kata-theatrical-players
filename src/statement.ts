import {
    calculateAmount,
    calculateTotalAmount,
    calculateTotalCredits,
    Performance,
    PerformanceSummary,
    Play
} from "./performanceCalculator";

export type Statement = {
    readonly customer: string;
    readonly performances: PerformanceRow[];
    readonly totalAmountInUSD: string;
    readonly totalCredits: number;
}

export function createStatement(summary: PerformanceSummary, plays: Record<string, Play>): Statement {
    let totalAmount = calculateTotalAmount(summary, plays);

    return {
        customer: summary.customer,
        performances: summary.performances.map(p => createPerformanceRow(p, plays)),
        totalAmountInUSD: formatAsUSD(totalAmount),
        totalCredits: calculateTotalCredits(summary, plays)

    }
}

type PerformanceRow = {
    readonly playName: string;
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

function formatAsUSD(thisAmount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(thisAmount / 100);
}