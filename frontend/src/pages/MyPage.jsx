import "../styles/MyPage.css";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function MyPage() {
    const [user, setUser] = useState(null);
    const [originalUser, setOriginalUser] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [baseAddress, setBaseAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/user/me")
            .then(res => {
                setUser(res.data);
                setOriginalUser(res.data);
            })
            .catch(() => navigate("/login"));
    }, [navigate]);

    const startEdit = () => {
        setBaseAddress(user.address);
        setDetailAddress("");
        setEditMode(true);
    };

    const openAddress = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert("주소 검색 로딩 중입니다.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                setBaseAddress(data.address);
            }
        }).open();
    };

    const handleUpdate = async () => {
        const fullAddress = `${baseAddress} ${detailAddress}`.trim();

        try {
            await api.put("/api/user/me", {
                name: user.name,
                address: fullAddress,
                age: Number(user.age),
            });

            const updatedUser = {
                ...user,
                address: fullAddress,
                age: Number(user.age),
            };

            setUser(updatedUser);
            setOriginalUser(updatedUser);
            alert("수정 완료!");
            setEditMode(false);
        } catch (e) {
            alert("수정 실패");
        }
    };

    const handleCancel = () => {
        setUser(originalUser);
        setBaseAddress("");
        setDetailAddress("");
        setEditMode(false);
    };

    if (!user) return <div>로딩중...</div>;

    return (
        <div className="mypage">
            <div className="mypage-card">
                <h2>내 정보</h2>

                <div className="info-row">
                    <span className="info-label">이름</span>
                    {editMode ? (
                        <input
                            value={user.name}
                            onChange={(e) =>
                                setUser({ ...user, name: e.target.value })
                            }
                        />
                    ) : (
                        <span className="info-value">{user.name}</span>
                    )}
                </div>

                <div className="info-row address-edit-row">
                    <span className="info-label">주소</span>
                    {editMode ? (
                        <div className="mypage-address-wrap">
                            <div className="mypage-address-row">
                                <input
                                    value={baseAddress}
                                    readOnly
                                    placeholder="주소"
                                />
                                <button type="button" onClick={openAddress}>
                                    찾기
                                </button>
                            </div>

                            <input
                                value={detailAddress}
                                onChange={(e) => setDetailAddress(e.target.value)}
                                placeholder="상세주소"
                            />
                        </div>
                    ) : (
                        <span className="info-value">{user.address}</span>
                    )}
                </div>

                <div className="info-row">
                    <span className="info-label">나이</span>
                    {editMode ? (
                        <input
                            type="number"
                            value={user.age}
                            onChange={(e) =>
                                setUser({ ...user, age: e.target.value })
                            }
                        />
                    ) : (
                        <span className="info-value">{user.age}</span>
                    )}
                </div>

                <div className="mypage-actions">
                    {!editMode && (
                        <button
                            className="home-btn"
                            onClick={() => navigate("/")}
                        >
                            홈으로
                        </button>
                    )}

                    {editMode ? (
                        <>
                            <button className="update-btn" onClick={handleUpdate}>
                                저장
                            </button>
                            <button className="cancel-btn" onClick={handleCancel}>
                                취소
                            </button>
                        </>
                    ) : (
                        <button
                            className="update-btn"
                            onClick={startEdit}
                        >
                            수정
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyPage;