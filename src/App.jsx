import { useEffect, useState } from "react";
import axios from "axios";

const PRIORITY = { Placement: 3, Result: 2, Event: 1 };

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://4.224.186.213/evaluation-service/notifications")
      .then(res => {
        const data = res.data.data || res.data;
        const sorted = data.sort((a, b) => {
          if (PRIORITY[b.Type] !== PRIORITY[a.Type])
            return PRIORITY[b.Type] - PRIORITY[a.Type];
          return new Date(b.Timestamp) - new Date(a.Timestamp);
        });
        setNotifications(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "All"
    ? notifications
    : notifications.filter(n => n.Type === filter);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>Campus Notification System</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
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

      {loading ? <p>Loading...</p> : filtered.slice(0, 10).map(n => (
        <div key={n.ID} style={{
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