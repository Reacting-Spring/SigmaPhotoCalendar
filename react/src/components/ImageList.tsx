import { useEffect, useState } from "react";
import axiosInstance from "@/api/AxiosInstance";
import "@/css/ImageList.css";
import { showErrorToast, showInfoToast } from "./Toast";

type Props = {
  formattedDate: string;
};

interface ImageItem {
  id: string;
  src: string;
  blobUrl?: string;
  name: string;
  loading: boolean;
  error: boolean;
}

export default function ImageList({ formattedDate }: Props) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 이미지 목록 가져오기
  useEffect(() => {
    const getImageList = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/files/images", {
          params: {
            date: formattedDate,
          },
        });

        const imageList: ImageItem[] = response.data.map((src: string, index: number) => ({
          id: `${index}-${src.split("/").pop()}`,
          src: src,
          name: src.split("/").pop() || `image-${index}`,
          loading: true,
          error: false,
        }));

        setImages(imageList);
        console.log("이미지 목록:", imageList);
      } catch (error) {
        console.log("이미지 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (formattedDate) {
      getImageList();
    }
  }, [formattedDate]);

  // 개별 이미지 blob URL 생성
  useEffect(() => {
    const loadImageBlobs = async () => {
      for (const image of images) {
        if (!image.blobUrl && !image.error) {
          try {
            const response = await axiosInstance.get(`/static/uploads${image.src}`, {
              responseType: "blob",
            });

            const blobUrl = URL.createObjectURL(response.data);

            setImages((prevImages) =>
              prevImages.map((img) => (img.id === image.id ? { ...img, blobUrl, loading: false } : img))
            );
          } catch (error) {
            console.error(`이미지 로드 실패: ${image.src}`, error);
            setImages((prevImages) =>
              prevImages.map((img) => (img.id === image.id ? { ...img, loading: false, error: true } : img))
            );
          }
        }
      }
    };

    if (images.length > 0) {
      loadImageBlobs();
    }

    // 컴포넌트 언마운트 시 blob URL 정리
    return () => {
      images.forEach((image) => {
        if (image.blobUrl) {
          URL.revokeObjectURL(image.blobUrl);
        }
      });
    };
  }, [images.length]);

  // 개별 이미지 선택/해제
  const handleImageSelect = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
    setIsAllSelected(newSelected.size === images.length && images.length > 0);
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedImages(new Set());
      setIsAllSelected(false);
    } else {
      const allIds = new Set(images.map((img) => img.id));
      setSelectedImages(allIds);
      setIsAllSelected(true);
    }
  };

  // 단일 이미지 다운로드
  const downloadImage = async (image: ImageItem) => {
    try {
      const response = await axiosInstance.get(`/static/uploads${image.src}`, {
        responseType: "blob",
      });

      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
      showErrorToast("이미지 다운로드에 실패했습니다.");
    }
  };

  // 선택된 이미지들 다운로드
  const handleDownloadSelected = async () => {
    if (selectedImages.size === 0) {
      showInfoToast("다운로드할 이미지를 선택해주세요.");
      return;
    }

    setDownloading(true);

    try {
      const selectedImageItems = images.filter((img) => selectedImages.has(img.id));

      if (selectedImages.size === 1) {
        // 단일 이미지 다운로드
        await downloadImage(selectedImageItems[0]);
      } else {
        // 여러 이미지 순차 다운로드
        for (const image of selectedImageItems) {
          await downloadImage(image);
          // 브라우저가 다운로드를 처리할 시간을 줌
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // 다운로드 후 선택 초기화
      setSelectedImages(new Set());
      setIsAllSelected(false);
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
      showErrorToast("이미지 다운로드에 실패했습니다.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="image-list-container">
        <div className="loading">이미지를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="image-list-container">
      {images.length > 0 && (
        <div className="image-controls">
          <div className="select-controls">
            <label className="select-all-label">
              <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
              전체 선택 ({selectedImages.size}/{images.length})
            </label>
          </div>

          <button
            className="download-button"
            onClick={handleDownloadSelected}
            disabled={selectedImages.size === 0 || downloading}
          >
            {downloading ? "다운로드 중..." : `선택된 이미지 다운로드 (${selectedImages.size}개)`}
          </button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="no-images">해당 날짜에 이미지가 없습니다.</div>
      ) : (
        <div className="image-grid">
          {images.map((image) => (
            <div key={image.id} className={`image-item ${selectedImages.has(image.id) ? "selected" : ""}`}>
              <div className="image-wrapper">
                {image.loading ? (
                  <div className="image-loading">
                    <div className="loading-spinner"></div>
                    <span>로딩 중...</span>
                  </div>
                ) : image.error ? (
                  <div className="image-error">
                    <span>이미지 로드 실패</span>
                  </div>
                ) : (
                  <img src={image.blobUrl || "/placeholder.svg"} alt={image.name} loading="lazy" />
                )}

                <div className="image-overlay">
                  <input
                    type="checkbox"
                    className="image-checkbox"
                    checked={selectedImages.has(image.id)}
                    onChange={() => handleImageSelect(image.id)}
                    disabled={image.loading || image.error}
                  />
                </div>

                {!image.loading && !image.error && (
                  <button
                    className="download-single-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(image);
                    }}
                    title="이미지 다운로드"
                  >
                    ⬇
                  </button>
                )}
              </div>
              <div className="image-name">{image.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
