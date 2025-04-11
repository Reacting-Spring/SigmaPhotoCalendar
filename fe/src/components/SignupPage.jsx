import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        if (!email || !password) {
            alert("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/signup", {
                user_id: email,
                password: password,
            });

            alert("회원가입 성공!");
        } catch (error) {
            if (error.response) {
                alert(`회원가입 실패! 오류: ${error.response.data.message}`);
            } else {
                alert("서버 연결 실패! 백엔드가 실행 중인지 확인하세요.");
            }
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="text-5xl font-bold pt-10 leading-20">회원가입</div>
            <div>
                <input
                    type="text"
                    placeholder="이메일을 입력해주세요"
                    className="border border-stone-400 p-2 pl-4 pr-4 w-xs rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    className="border border-stone-400 p-2 pl-4 pr-4 w-xs rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="flex items-center space-x-2">
                <p>계정이 이미 있나요?</p>
                <Link to="/login" className="text-blue-500">
                    로그인
                </Link>
            </div>
            <button className="bg-stone-700 text-white p-2 mt-5 w-xs rounded-lg" onClick={handleSignup}>
                회원가입
            </button>
        </div>
    );
}

export default SignupPage;
