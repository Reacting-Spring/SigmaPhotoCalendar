import axios from "axios";
import { useState } from "react";
import { useAuth } from "../AuthContext"; // AuthContext에서 가져오기

function UploadImage() {
    const { accessToken } = useAuth(); // accessToken 가져오기
    console.log("Access Token:", accessToken);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // 이미지 선택 핸들러
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            // 이미지 미리보기 생성
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    };

    // API 요청 함수
    const uploadImage = async () => {
        if (!selectedImage) {
            alert("이미지를 선택해주세요");
            return;
        }

        try {
            // FormData 객체 생성
            const formData = new FormData();
            formData.append("file", selectedImage);

            // 서버로 이미지 전송
            const response = await axios.post("http://localhost:8080/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`, // accessToken 사용
                },
                withCredentials: true,
            });

            console.log("업로드 성공:", response.data);
            alert("이미지 업로드 성공!");
        } catch (error) {
            console.error("업로드 실패:", error);
            if (error.response && error.response.status === 403) {
                alert("권한이 없습니다. 다시 로그인해주세요.");
            } else {
                alert("이미지 업로드 실패");
            }
        }
    };

    return (
        <>
            {/* 이미지 업로드 섹션 */}
            <div className="w-full max-w-xs mt-4">
                <label className="block text-sm font-medium mb-2">이미지 업로드</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-stone-700 file:text-white
                    hover:file:bg-stone-600"
                />
            </div>

            {/* 이미지 미리보기 */}
            {previewUrl && (
                <div className="mt-2">
                    <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="미리보기"
                        className="w-32 h-32 object-cover rounded-md border border-gray-300"
                    />
                </div>
            )}
            <button className="bg-stone-700 text-white text-lg w-full p-2 mt-4 rounded-md" onClick={uploadImage}>
                이미지 업로드
            </button>
        </>
    );
}
export default UploadImage;
