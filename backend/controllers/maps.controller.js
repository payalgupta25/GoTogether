import axios from 'axios';

export const getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    if (input.length < 3) {
        throw new Error('Must be at least 3 characters long');
    }

    const apiKey = "mDO5KfGVfRkA5MEeyU2iRVcCFu3gN6uF";
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(input)}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const results = response.data.results;

        const suggestions = results.map(r => r.address?.freeformAddress).filter(Boolean);
        return suggestions;
    } catch (err) {
        console.error(err);
        throw new Error('Unable to fetch suggestions');
    }
};


export const getCoordinates = async (place) => {
  const apiKey = "mDO5KfGVfRkA5MEeyU2iRVcCFu3gN6uF";
  const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(place)}.json?key=${apiKey}`;
    console.log("url", url);
    
  try {
    console.log("Fetching coordinates for:", place);
    const response = await axios.get(url);

    // console.log("TomTom Geocode Raw Response:", JSON.stringify(response.data, null, 2));
    const position = response.data.results[0]?.position;

    if (!position) {
      console.error("No position found in response");
      throw new Error("Location not found");
    }

    return {
      lng: position.lon,
      lat: position.lat,
    };
  } catch (err) {
    console.error("Error in getCoordinates:", err.response?.data || err.message);
    throw new Error("Unable to fetch coordinates");
  }
};
