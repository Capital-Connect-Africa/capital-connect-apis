export const fundBands = {
    Seed: [0, 100000],
    PreSeries: [100001, 500000],
    SeriesA: [500001, 1000000],
    SeriesB: [1000001, 3000000],
    SeriesC: [3000001, 10000000],
    GrowthStage: [10000001, 20000000],
    LateGrowthStage: [20000001, 50000000],
    ExpansionStage: [50000001, Number.MAX_SAFE_INTEGER],
  } as const;