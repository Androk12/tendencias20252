import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LogsView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/logs/")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch((err) => console.error("Error al obtener logs:", err));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Cargando logs...
      </div>
    );

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📜 Últimos Logs del Servidor</h2>

      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-4 overflow-y-auto h-[60vh] font-mono text-gray-800 border border-gray-200">
        {logs.map((line, i) => (
          <div key={i} className="mb-1">
            {line}
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/dashboardAdmin")}
        className="mt-6 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:from-blue-500 hover:to-green-400 transition-colors duration-300"
      >
        ⬅ Volver al Dashboard
      </button>
    </div>
  );
}

export default LogsView;

