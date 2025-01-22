export const predictProspectPotential = (playerStats) => {
  // Placeholder logic for prediction
  const { battingAverage, homeRuns, gamesPlayed } = playerStats;
  const potentialScore = (battingAverage * 1000 + homeRuns * 10) / gamesPlayed;
  return potentialScore > 50 ? "High Impact" : "Moderate Impact";
};
