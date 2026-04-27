import "../styles/Header.css";
import { useNavigate } from "react-router-dom";


function Header({ dark, setDark }) {
    const navigate = useNavigate();

    return (
        <div className="chat-header">

            {/* 가운데 제목 */}
            <span className="header-title">
                청년 지원 AI 도우미
            </span>

            {/* 오른쪽 묶음 */}
            <div className="header-right">
                <button className="login-btn" onClick={() => navigate("/login")}>
                    로그인
                </button>

                <button
                    className="theme-toggle"
                    onClick={() => setDark(!dark)}
                >
                    {dark ? "☀️" : "🌙"}
                </button>
            </div>

        </div>
    );
}

export default Header;