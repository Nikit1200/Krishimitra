import { useState } from "react";

const states = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal"
];

const MandiPrices: React.FC = () => {
  const [state, setState] = useState("");
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMandiPrices = async () => {
    if (!state) {
      alert("Please select a state.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=10&filters[state]=${encodeURIComponent(
        state
      )}`;

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data.records || data.records.length === 0) {
        setPrices([]);
        setError("No data available for this state.");
        return;
      }

      setPrices(data.records);
    } catch (err: any) {
      console.error(err);
      setError("Error fetching mandi prices. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛒 Live Mandi Prices
      </h2>

      {/* State Dropdown */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border p-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="">-- Choose State --</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={getMandiPrices}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
        >
          {loading ? "Loading..." : "Get Prices"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-center text-red-600 mb-4">{error}</p>}

      {/* Table */}
      {prices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="border px-4 py-2">Commodity</th>
                <th className="border px-4 py-2">Market</th>
                <th className="border px-4 py-2">District</th>
                <th className="border px-4 py-2">Min Price (₹/qtl)</th>
                <th className="border px-4 py-2">Max Price (₹/qtl)</th>
                <th className="border px-4 py-2">Modal Price (₹/qtl)</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-4 py-2">{item.commodity}</td>
                  <td className="border px-4 py-2">{item.market}</td>
                  <td className="border px-4 py-2">{item.district}</td>
                  <td className="border px-4 py-2">{item.min_price}</td>
                  <td className="border px-4 py-2">{item.max_price}</td>
                  <td className="border px-4 py-2">{item.modal_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No data */}
      {!loading && !error && prices.length === 0 && (
        <p className="text-center text-gray-500">Select a state to view prices.</p>
      )}
    </div>
  );
};

export default MandiPrices;
