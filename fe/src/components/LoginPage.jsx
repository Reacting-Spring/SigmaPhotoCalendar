import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const { setAccessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAutoLogin = async () => {
            try {
                const response = await axios.post("http://localhost:8080/api/refresh", {}, { withCredentials: true });

                if (response.data.access_token) {
                    setAccessToken(response.data.access_token);
                    console.log("자동 로그인 성공");
                    navigate("/dashboard");
                } else {
                    console.log("accessToken이 없습니다.");
                }
            } catch (error) {
                console.log("자동 로그인 실패", error);
            }
        };
        checkAutoLogin();
    }, [navigate]);

    const handleLogin = async () => {
        if (!id || !password) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/login",
                {
                    user_id: id,
                    password: password,
                },
                { withCredentials: true }
            );

            setAccessToken(response.data.accessToken);
            alert("로그인 성공!");
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                alert(`로그인 실패! 오류: ${error.response.data.message}`);
            } else {
                alert("로그인 실패! 백엔드가 실행 중인지 확인하세요.");
            }
            console.error("Error:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center space-y-2">
                <div className="text-5xl font-bold mr-45 pt-10 leading-20">로그인</div>
                <div>
                    <input
                        type="text"
                        placeholder="아이디를 입력해주세요"
                        className="border border-stone-400 p-2 pl-4 pr-4 w-xs rounded-lg"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    ></input>
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        className="border border-stone-400 p-2 pl-4 pr-4 w-xs rounded-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>
                <div className="flex items-center space-x-2 mr-35">
                    <p>계정이 없나요?</p>
                    <Link to="/signup" className="text-blue-500">
                        회원가입
                    </Link>
                </div>
                <button className="bg-stone-700 text-white p-2 mt-5 w-xs rounded-lg" onClick={handleLogin}>
                    로그인
                </button>
            </div>
        </>
    );
}

export default LoginPage;
