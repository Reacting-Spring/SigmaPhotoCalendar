import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios"; // axios 라이브러리 import

function ImageList({ selectedDate, year, month }) {
  // 이미지 관련 상태 관리
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태
  const [images, setImages] = useState([]); // 이미지 목록 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const prevPropsRef = useRef({ selectedDate, year, month });

  // 이미지 가져오기 함수 (메모이제이션)
  const fetchImages = useCallback(async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("http://localhost:8080/api/images", {
        params: {
          year,
          month,
          selectedDate,
        },
      });

      setImages(response.data);
    } catch (err) {
      setError("이미지를 불러오는데 실패했습니다.");
      console.error("이미지 로딩 에러:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, year, month]);

  // 컴포넌트 마운트 시 이미지 가져오기
  useEffect(() => {
    // 이전 props와 현재 props를 비교하여 변경이 있을 때만 fetchImages 호출
    const prevProps = prevPropsRef.current;
    if (prevProps.selectedDate !== selectedDate || prevProps.year !== year || prevProps.month !== month) {
      fetchImages();
      prevPropsRef.current = { selectedDate, year, month };
    }
  }, [selectedDate, year, month, fetchImages]);

  // 이미지를 클릭했을 때 호출되는 함수
  const showImage = (src) => {
    setSelectedImage(src);
  };

  // 이미지를 닫는 함수
  const closeImage = () => {
    setSelectedImage(null);
  };

  // 이미지 목록 렌더링 (메모이제이션)
  const imageList = useMemo(() => {
    if (loading) return <div className="text-center">로딩 중...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (images.length === 0) return <div className="text-center">등록된 이미지가 없습니다.</div>;

    return (
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <img src={image.url} alt={`${selectedDate}일 이미지`} className="w-full h-48 object-cover rounded-lg" />
          </div>
        ))}
      </div>
    );
  }, [loading, error, images, selectedDate]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">{selectedDate}일 이미지 목록</h3>
      {imageList}
    </div>
  );
}

export default ImageList;
