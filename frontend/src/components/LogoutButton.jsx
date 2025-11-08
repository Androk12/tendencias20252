// src/components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access"); // 🔥 limpia el token
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} style={styles.button}>
      Cerrar sesión
    </button>
  );
}

const styles = {
  button: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    marginTop: "15px",
  },
};
