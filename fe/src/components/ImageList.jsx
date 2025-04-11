import { useState, useEffect } from "react";
import axios from "axios"; // axios 라이브러리 import

function ImageList(selectedDate) {
    const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태

    // 이미지를 클릭했을 때 호출되는 함수
    function showImage(src) {
        setSelectedImage(src); // 클릭한 이미지의 src 값을 상태에 저장
    }

    // 이미지를 닫는 함수
    function closeImage() {
        setSelectedImage(null); // 선택된 이미지 없애기
    }

    useEffect(() => {
        if (selectedDate) {
            axios
                .get(`http://localhost:8080/api/images/${year}/${month}/${selectedDate}`)
                .then((response) => {
                    setImages(response.data); // 서버에서 받아온 이미지 데이터 설정
                })
                .catch((error) => {
                    console.error("사진 불러오기 실패: ", error);
                });
        }
    }, [selectedDate]);

    return (
        <>
            <div className="flex flex-wrap">
                {/* 작은 이미지 클릭 시 showImage 함수 호출 */}
                <img
                    src="`http://localhost:8080/api/images/${year}/${month}/${selectedDate}`"
                    className="w-30 h-30 cursor-pointer"
                    onClick={() => showImage("`http://localhost:8080/api/images/${year}/${month}/${selectedDate}`")}
                />

                {/* <img
                    src="./menu.png"
                    className="w-30 h-30 cursor-pointer"
                    onClick={() => showImage("./menu.png")}
                    alt="menu"
                />
                <img
                    src="./another-image.png"
                    className="w-30 h-30 cursor-pointer"
                    onClick={() => showImage("./another-image.png")}
                    alt="another image"
                />
                <img
                    src="./another-image2.png"
                    className="w-30 h-30 cursor-pointer"
                    onClick={() => showImage("./another-image2.png")}
                    alt="another image 2"
                /> */}
            </div>

            {/* 선택된 이미지를 크게 보여주는 모달 */}
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="relative bg-white p-4">
                        <button
                            className="absolute top-2 right-2 text-black text-6xl"
                            onClick={closeImage} // 모달 닫기 버튼
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImage}
                            className="w-96 h-auto shadow-lg" // 그림자 추가
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default ImageList;
