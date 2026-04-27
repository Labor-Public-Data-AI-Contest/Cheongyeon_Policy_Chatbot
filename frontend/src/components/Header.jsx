import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

function Header({ dark, setDark }) {
    const navigate = useNavigate();
    const { isLogin, logout } = useAuth(); 

    const handleAuth = () => {
        if (isLogin) {
            logout(); 
            navigate("/");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="chat-header">

            <span className="header-title">
                청년 지원 AI 도우미
            </span>

            <div className="header-right">
                <button className="login-btn" onClick={handleAuth}>
                    {isLogin ? "로그아웃" : "로그인"}
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