import axios from "axios";
import { useState } from "react";
import { useAuth } from "../AuthContext"; // AuthContext에서 가져오기

function UploadImage() {
  const { accessToken } = useAuth(); // accessToken 가져오기

  // 업로드 관련 상태 관리
  const [uploadState, setUploadState] = useState({
    selectedImage: null, // 선택된 이미지
    previewUrl: null, // 미리보기 URL
    isUploading: false, // 업로드 중 상태
    error: null, // 에러 메시지
  });

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadState((prev) => ({
        ...prev,
        error: "파일 크기는 5MB를 초과할 수 없습니다.",
      }));
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      setUploadState((prev) => ({
        ...prev,
        error: "이미지 파일만 업로드 가능합니다.",
      }));
      return;
    }

    setUploadState((prev) => ({
      ...prev,
      selectedImage: file,
      error: null,
    }));

    // 이미지 미리보기 생성
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setUploadState((prev) => ({
        ...prev,
        previewUrl: fileReader.result,
      }));
    };
    fileReader.readAsDataURL(file);
  };

  // API 요청 함수
  const uploadImage = async () => {
    if (!uploadState.selectedImage) {
      setUploadState((prev) => ({
        ...prev,
        error: "이미지를 선택해주세요",
      }));
      return;
    }

    setUploadState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
    }));

    try {
      // FormData 객체 생성
      const formData = new FormData();
      formData.append("file", uploadState.selectedImage);

      // 서버로 이미지 전송
      const response = await axios.post("http://localhost:8080/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`, // accessToken 사용
        },
        withCredentials: true,
      });

      // 업로드 성공 후 상태 초기화
      setUploadState({
        selectedImage: null,
        previewUrl: null,
        isUploading: false,
        error: null,
      });

      alert("이미지 업로드 성공!");
    } catch (error) {
      console.error("업로드 실패:", error);
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        error:
          error.response?.status === 403
            ? "권한이 없습니다. 다시 로그인해주세요."
            : "이미지 업로드에 실패했습니다. 다시 시도해주세요.",
      }));
    }
  };

  return (
    <div className="space-y-4">
      {/* 에러 메시지 표시 */}
      {uploadState.error && <div className="text-red-500 text-sm text-center">{uploadState.error}</div>}

      {/* 이미지 업로드 섹션 */}
      <div className="w-full max-w-xs">
        <label className="block text-sm font-medium mb-2">이미지 업로드</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploadState.isUploading}
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-stone-700 file:text-white
                    hover:file:bg-stone-600
                    disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* 이미지 미리보기 */}
      {uploadState.previewUrl && (
        <div className="mt-2">
          <img
            src={uploadState.previewUrl}
            alt="미리보기"
            className="w-32 h-32 object-cover rounded-md border border-gray-300"
          />
        </div>
      )}

      {/* 업로드 버튼 */}
      <button
        className={`w-full p-2 rounded-md text-white transition-colors
                   ${uploadState.isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-stone-700 hover:bg-stone-600"}`}
        onClick={uploadImage}
        disabled={uploadState.isUploading || !uploadState.selectedImage}
      >
        {uploadState.isUploading ? "업로드 중..." : "이미지 업로드"}
      </button>
    </div>
  );
}

export default UploadImage;
