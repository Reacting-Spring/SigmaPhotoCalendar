import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Logout() {
    const navigate = useNavigate();
    const { setAccessToken } = useAuth();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });

            setAccessToken("");
            alert("로그아웃 성공!");
            navigate("/login");
        } catch (error) {
            console.error("로그아웃 실패:", error);
            alert("로그아웃 실패!");
        }
    };
    return (
        <>
            <button onClick={handleLogout}>로그아웃</button>
        </>
    );
}

export default Logout;
