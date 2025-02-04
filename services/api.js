import axios from "axios";

const BASE_URL = "https://statsapi.mlb.com/api/v1";

export const fetchSports = async () => {
  const response = await axios.get(`${BASE_URL}/sports`);
  return response.data.sports;
};

export const fetchTeams = async () => {
  const response = await axios.get(`${BASE_URL}/teams?sportId=1`);
  return response.data.teams;
};

export const fetchTeamRoster = async (teamId) => {
  const response = await axios.get(
    `${BASE_URL}/teams/${teamId}/roster?season=2025`
  );
  return response.data.roster;
};

export const fetchPlayerStats = async (playerId) => {
  const response = await axios.get(
    `${BASE_URL}/people/${playerId}/stats?stats=career`
  );
  return response.data.stats;
};

// Example of using public datasets
export const fetchHomeRunsData = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

export async function fetchPlayerHeadshot(playerId) {
  return `https://securea.mlb.com/mlb/images/players/head_shot/${playerId}.jpg`;
}

export async function predictPlayerPotential(player) {
  // Mock Google Gemini API integration for player prediction
  return {
    projectedImpact: (Math.random() * 100).toFixed(2), // Random for demo
    careerPotential: (Math.random() * 10).toFixed(1), // Random for demo
  };
}

export const fetchSeasonPlayers = async (season) => {
  const response = await fetch(
    `https://statsapi.mlb.com/api/v1/sports/1/players?season=${season}`
  );
  const data = await response.json();

  return data.people
    .map((player) => {
      const strikeZone =
        player.strikeZoneTop && player.strikeZoneBottom
          ? player.strikeZoneTop - player.strikeZoneBottom
          : 0;

      const performanceScore =
        (player.stats?.[0]?.splits?.[0]?.stat?.avg || 0) * 1000 +
        (strikeZone || 0) * 10;

      return {
        id: player.id,
        fullName: player.fullName,
        teamName: player.currentTeam?.name || "Unknown",
        battingAverage: player.stats?.[0]?.splits?.[0]?.stat?.avg || "N/A",
        strikeZoneTop: player.strikeZoneTop || "N/A",
        strikeZoneBottom: player.strikeZoneBottom || "N/A",
        rank: Math.round(performanceScore),
        headshotUrl: `https://securea.mlb.com/mlb/images/players/head_shot/${player.id}.jpg`,
        currentAge: player.currentAge,
        birthCountry: player.birthCountry,
        height: player.height,
        weight: player.weight,
        primaryPosition: player.primaryPosition,
        batSide: player.batSide,
        pitchHand: player.pitchHand,
      };
    })
    .sort((a, b) => b.rank - a.rank); // Sort by rank descending
};

export const fetchPlayerDetails = async (id) => {
  const response = await fetch(`https://statsapi.mlb.com/api/v1/people/${id}`);
  const data = await response.json();
  const player = data.people[0];

  const strikeZone =
    player.strikeZoneTop && player.strikeZoneBottom
      ? player.strikeZoneTop - player.strikeZoneBottom
      : 0;

  const performanceScore =
    (player.stats?.[0]?.splits?.[0]?.stat?.avg || 0) * 1000 +
    (strikeZone || 0) * 10;

  const prediction = await fetchPlayerProspectPrediction(player);

  return {
    id: player.id,
    fullName: player.fullName,
    teamName: player.currentTeam?.name || "Unknown",
    battingAverage: player.stats?.[0]?.splits?.[0]?.stat?.avg || "N/A",
    strikeZoneTop: player.strikeZoneTop || "N/A",
    strikeZoneBottom: player.strikeZoneBottom || "N/A",
    rank: Math.round(performanceScore),
    prediction,
    headshotUrl: `https://securea.mlb.com/mlb/images/players/head_shot/${player.id}.jpg`,
    currentAge: player.currentAge,
    birthCountry: player.birthCountry,
    height: player.height,
    weight: player.weight,
    primaryPosition: player.primaryPosition,
    batSide: player.batSide,
    pitchHand: player.pitchHand,
  };
};

export const fetchPlayerProspectPrediction = async (player) => {
  // Placeholder for Google Gemini API integration
  const prediction = `Based on a strike zone of ${
    player.strikeZoneTop - player.strikeZoneBottom
  } and a batting average of ${
    player.stats?.[0]?.splits?.[0]?.stat?.avg || "N/A"
  }, this player is projected to make a significant impact in the MLB.`;
  return prediction;
};
