import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header({ dark, setDark }) {
    const navigate = useNavigate();
    const { isLogin, logout } = useAuth();

    return (
        <div className="chat-header">

            <span className="header-title">
                청년 지원 AI 도우미
            </span>

            <div className="header-right">

                {isLogin ? (
                    <>
                        <button
                            className="info-btn"
                            onClick={() => navigate("/mypage")}
                        >
                            내정보
                        </button>

                        <button
                            className="login-btn"
                            onClick={() => {
                                logout();
                                navigate("/");
                            }}
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    <button
                        className="login-btn"
                        onClick={() => navigate("/login")}
                    >
                        로그인
                    </button>
                )}

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