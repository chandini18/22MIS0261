import { useEffect, useState } from "react";

const PRIORITY = { Placement: 3, Result: 2, Event: 1 };
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaGFuZGluaWowMTRAZ21haWwuY29tIiwiZXhwIjoxNzc4OTMxNzQ0LCJpYXQiOjE3Nzg5MzA4NDQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJiMDgyZTZhYS02ZDc4LTQ1YjgtYTFmYy05Mjk3OTc0MzkyZDUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJjaGFuZGluaSBqIiwic3ViIjoiYjBhYTBlN2EtNGIxZC00Nzk4LThmNDAtN2FmYWI5NWNiYmJhIn0sImVtYWlsIjoiY2hhbmRpbmlqMDE0QGdtYWlsLmNvbSIsIm5hbWUiOiJjaGFuZGluaSBqIiwicm9sbE5vIjoiMjJtaXMwMjYxeCIsImFjY2Vzc0NvZGUiOiJTZkZ1V2ciLCJjbGllbnRJRCI6ImIwYWEwZTdhLTRiMWQtNDc5OC04ZjQwLTdhZmFiOTVjYmJiYSIsImNsaWVudFNlY3JldCI6IkRiZU1aWWh5RGZ5dHN5bWgifQ._KR_Fkzhj5NRBolFOXms1CrilD-65RgppqOnDGEUeoo";

async function Log(stack, level, packageName, message) {
  try {
    await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify({ stack, level, package: packageName, message })
    });
  } catch (err) {
    console.log("Log error:", err.message);
  }
}

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    Log("frontend", "info", "component", "App initialized");
    fetch("http://4.224.186.213/evaluation-service/notifications", {
      headers: { Authorization: `Bearer ${TOKEN}` }
    })
      .then(res => res.json())
      .then(data => {
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
        Log("frontend", "info", "api", "Notifications fetched successfully");
      })
      .catch(err => {
        setError("API Error: " + err.message);
        setLoading(false);
        Log("frontend", "error", "api", "Failed to fetch notifications");
      });
  }, []);

  const handleFilter = (type) => {
    setFilter(type);
    Log("frontend", "info", "filter", `Filter changed to ${type}`);
  };

  const handleView = (id) => {
    if (!viewed.includes(id)) {
      setViewed([...viewed, id]);
      Log("frontend", "info", "notification", `Notification ${id} marked as viewed`);
    }
  };

  const filtered = filter === "All"
    ? notifications
    : notifications.filter(n => n.Type === filter);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🔔 Campus Notification System</h1>

      {/* Filter Buttons */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        {["All", "Placement", "Result", "Event"].map(type => (
          <button
            key={type}
            onClick={() => handleFilter(type)}
            style={{
              padding: "8px 20px",
              background: filter === type ? "#1976d2" : "#eee",
              color: filter === type ? "white" : "black",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading notifications...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {!loading && notifications.length === 0 && <p style={{ textAlign: "center" }}>No notifications found.</p>}

      {/* Notification Cards */}
      {filtered.slice(0, 10).map((n, i) => {
        const isViewed = viewed.includes(n.ID || i);
        return (
          <div
            key={n.ID || i}
            onClick={() => handleView(n.ID || i)}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              cursor: "pointer",
              opacity: isViewed ? 0.6 : 1,
              background: isViewed ? "#f5f5f5" : "white",
              borderLeft: `5px solid ${
                n.Type === "Placement" ? "#1976d2" :
                n.Type === "Result" ? "#388e3c" : "#f57c00"
              }`
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{
                background: n.Type === "Placement" ? "#1976d2" :
                  n.Type === "Result" ? "#388e3c" : "#f57c00",
                color: "white", padding: "2px 8px", borderRadius: 4, fontSize: 12
              }}>{n.Type}</span>
              {!isViewed && (
                <span style={{
                  background: "red", color: "white",
                  borderRadius: "50%", width: 10, height: 10,
                  display: "inline-block"
                }} />
              )}
              {isViewed && <span style={{ fontSize: 12, color: "#999" }}>✓ Viewed</span>}
            </div>
            <p style={{ margin: "8px 0", fontWeight: isViewed ? "normal" : "bold" }}>{n.Message}</p>
            <small style={{ color: "#999" }}>{n.Timestamp}</small>
          </div>
        );
      })}
    </div>
  );
}