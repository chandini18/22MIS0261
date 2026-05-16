import { useEffect, useState } from "react";

const PRIORITY = { Placement: 3, Result: 2, Event: 1 };
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaGFuZGluaWowMTRAZ21haWwuY29tIiwiZXhwIjoxNzc4OTMxNzQ0LCJpYXQiOjE3Nzg5MzA4NDQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJiMDgyZTZhYS02ZDc4LTQ1YjgtYTFmYy05Mjk3OTc0MzkyZDUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJjaGFuZGluaSBqIiwic3ViIjoiYjBhYTBlN2EtNGIxZC00Nzk4LThmNDAtN2FmYWI5NWNiYmJhIn0sImVtYWlsIjoiY2hhbmRpbmlqMDE0QGdtYWlsLmNvbSIsIm5hbWUiOiJjaGFuZGluaSBqIiwicm9sbE5vIjoiMjJtaXMwMjYxeCIsImFjY2Vzc0NvZGUiOiJTZkZ1V2ciLCJjbGllbnRJRCI6ImIwYWEwZTdhLTRiMWQtNDc5OC04ZjQwLTdhZmFiOTVjYmJiYSIsImNsaWVudFNlY3JldCI6IkRiZU1aWWh5RGZ5dHN5bWgifQ._KR_Fkzhj5NRBolFOXms1CrilD-65RgppqOnDGEUeoo";

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://4.224.186.213/evaluation-service/notifications", {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data);
        const list = Array.isArray(data) ? data :
                     Array.isArray(data.data) ? data.data :
                     Array.isArray(data.notifications) ? data.notifications : [];
        const sorted = [...list].sort((a, b) => {
          if (PRIORITY[b.Type] !== PRIORITY[a.Type])
            return PRIORITY[b.Type] - PRIORITY[a.Type];
          return new Date(b.Timestamp) - new Date(a.Timestamp);
        });
        setNotifications(sorted);
        setLoading(false);
      })
      .catch(err => {
        setError("API Error: " + err.message);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "All"
    ? notifications
    : notifications.filter(n => n.Type === filter);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>🔔 Campus Notification System</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["All", "Placement", "Result", "Event"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: "8px 16px",
              background: filter === type ? "#1976d2" : "#eee",
              color: filter === type ? "white" : "black",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {loading && <p>Loading notifications...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && notifications.length === 0 && <p>No notifications found.</p>}

      {filtered.slice(0, 10).map((n, i) => (
        <div key={n.ID || i} style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 12,
          borderLeft: `5px solid ${
            n.Type === "Placement" ? "#1976d2" :
            n.Type === "Result" ? "#388e3c" : "#f57c00"
          }`
        }}>
          <span style={{
            background: n.Type === "Placement" ? "#1976d2" :
              n.Type === "Result" ? "#388e3c" : "#f57c00",
            color: "white", padding: "2px 8px", borderRadius: 4, fontSize: 12
          }}>{n.Type}</span>
          <p style={{ margin: "8px 0" }}>{n.Message}</p>
          <small style={{ color: "#999" }}>{n.Timestamp}</small>
        </div>
      ))}
    </div>
  );
}