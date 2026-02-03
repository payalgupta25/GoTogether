import axios from "axios";

const apiKey = "mDO5KfGVfRkA5MEeyU2iRVcCFu3gN6uF";

export const getCoordinates = async (from, to) => {
  const [fromRes, toRes] = await Promise.all([
    axios.get(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(from)}.json?key=${apiKey}`),
    axios.get(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(to)}.json?key=${apiKey}`),
  ]);

  const fromPos = fromRes.data.results[0]?.position;
  const toPos = toRes.data.results[0]?.position;

  if (!fromPos || !toPos) throw new Error("Could not fetch both coordinates");

  return {
    from: {
      lat: fromPos.lat,
      lng: fromPos.lon,
    },
    to: {
      lat: toPos.lat,
      lng: toPos.lon,
    },
  };
};
