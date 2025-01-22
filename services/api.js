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

// export const fetchSeasonPlayers = async (season) => {
//   const response = await axios.get(
//     `${BASE_URL}/sports/1/players?season=${season}`
//   );
//   return response.data.people;
// };

// Example of using public datasets
export const fetchHomeRunsData = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

// services/api.js
// export async function fetchSeasonPlayers(season) {
//   try {
//     const response = await fetch(
//       `https://statsapi.mlb.com/api/v1/sports/1/players?season=${season}`
//     );
//     const data = await response.json();
//     return data.people || [];
//   } catch (error) {
//     console.error("Error fetching players:", error);
//     return [];
//   }
// }

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

// // Fetch players for a specific season
// export const fetchSeasonPlayers = async (season) => {
//   const response = await axios.get(
//     `${BASE_API}/sports/1/players?season=${season}`
//   );
//   return response.data.people.map((player) => ({
//     id: player.id,
//     fullName: player.fullName,
//     headshotUrl: `https://securea.mlb.com/mlb/images/players/head_shot/${player.id}.jpg`,
//     teamName: player.currentTeam?.name || "N/A",
//     battingAverage: player.stats?.battingAverage || "N/A",
//     prospectRank: player.stats?.prospectRank || 999, // Default if no rank
//   }));
// };

// Fetch players for a specific season
export const fetchSeasonPlayers = async (season) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/sports/1/players?season=${season}`
    );
    console.log("API Response:", response.data); // Debug response

    if (!response.data.people) {
      console.warn("No players found in response!");
      return [];
    }

    return response.data.people.map((player) => ({
      id: player.id,
      fullName: player.fullName || "N/A",
      headshotUrl: `https://securea.mlb.com/mlb/images/players/head_shot/${player.id}.jpg`,
      teamName: player.currentTeam?.name || "Unknown Team",
      battingAverage: player.stats?.battingAverage || "N/A",
      prospectRank: player.stats?.prospectRank || 999, // Default if no rank
    }));
  } catch (error) {
    console.error("Error fetching season players:", error);
    return [];
  }
};

// Fetch individual player details
// export const fetchPlayerDetails = async (playerId) => {
//   const response = await axios.get(`${BASE_URL}/people/${playerId}`);
//   return response.data.people[0];
// };

// Fetch prospect prediction using Google Gemini
export const fetchPlayerProspectPrediction = async (player) => {
  // Placeholder for Google Gemini API integration
  const prediction = `Projected to be a key player based on historical comparisons and current performance.`;
  return prediction;
};

// export const fetchSeasonPlayers = async (season) => {
//   const response = await fetch(
//     `https://statsapi.mlb.com/api/v1/sports/1/players?season=${season}`
//   );
//   const data = await response.json();
//   return data.people.map((player) => ({
//     id: player.id,
//     fullName: player.fullName,
//     teamName: player.currentTeam?.name || "Unknown",
//     battingAverage: player.stats?.[0]?.splits?.[0]?.stat?.avg || "N/A",
//     prospectRank: Math.floor(Math.random() * 100) + 1, // Mocked prospect rank
//     headshotUrl: `https://securea.mlb.com/mlb/images/players/head_shot/${player.id}.jpg`,
//   }));
// };

export const fetchPlayerDetails = async (id) => {
  const response = await fetch(`https://statsapi.mlb.com/api/v1/people/${id}`);
  const data = await response.json();
  const player = data.people[0];
  const prediction = await fetchPlayerProspectPrediction(player);
  return {
    id: player.id,
    fullName: player.fullName,
    teamName: player.currentTeam?.name || "Unknown",
    battingAverage: player.stats?.[0]?.splits?.[0]?.stat?.avg || "N/A",
    prospectRank: Math.floor(Math.random() * 100) + 1, // Mocked prospect rank
    prediction,
    headshotUrl: `https://securea.mlb.com/mlb/images/players/head_shot/${player.id}.jpg`,
  };
};

// // Fetch prospect prediction using Google Gemini
// export const fetchPlayerProspectPrediction = async (player) => {
//   // Placeholder for Google Gemini API integration
//   const prediction = `Projected to be a key player based on historical comparisons and current performance.`;
//   return prediction;
// };
