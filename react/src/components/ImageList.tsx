import { useEffect, useState } from "react";
import axiosInstance from "@/api/AxiosInstance";
import { showErrorToast, showInfoToast, showSuccessToast } from "./Toast";
import { showDeleteConfirm, showMultiDeleteConfirm } from "./ConfirmDialog";
import "@/css/ImageList.css";

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
  const [deleting, setDeleting] = useState(false);

  // 이미지 미리보기 모달 상태
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!previewImage) return;

      switch (e.key) {
        case "Escape":
          setPreviewImage(null);
          break;
        case "ArrowLeft":
          handlePrevImage();
          break;
        case "ArrowRight":
          handleNextImage();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [previewImage, currentImageIndex]);

  // 이미지 미리보기 열기
  const handleImagePreview = (image: ImageItem) => {
    if (image.loading || image.error) return;

    const imageIndex = images.findIndex((img) => img.id === image.id);
    setCurrentImageIndex(imageIndex);
    setPreviewImage(image);
  };

  // 이전 이미지로 이동
  const handlePrevImage = () => {
    const availableImages = images.filter((img) => !img.loading && !img.error);
    if (availableImages.length === 0) return;

    const currentAvailableIndex = availableImages.findIndex((img) => img.id === previewImage?.id);
    const prevIndex = currentAvailableIndex > 0 ? currentAvailableIndex - 1 : availableImages.length - 1;
    const prevImage = availableImages[prevIndex];

    setPreviewImage(prevImage);
    setCurrentImageIndex(images.findIndex((img) => img.id === prevImage.id));
  };

  // 다음 이미지로 이동
  const handleNextImage = () => {
    const availableImages = images.filter((img) => !img.loading && !img.error);
    if (availableImages.length === 0) return;

    const currentAvailableIndex = availableImages.findIndex((img) => img.id === previewImage?.id);
    const nextIndex = currentAvailableIndex < availableImages.length - 1 ? currentAvailableIndex + 1 : 0;
    const nextImage = availableImages[nextIndex];

    setPreviewImage(nextImage);
    setCurrentImageIndex(images.findIndex((img) => img.id === nextImage.id));
  };

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

  // 단일 이미지 삭제
  const deleteImage = async (image: ImageItem) => {
    const confirmed = await showDeleteConfirm(image.name);
    if (!confirmed) return;

    try {
      await axiosInstance.delete("/files/images", {
        data: [image.name],
      });
      // 성공 시 이미지 목록에서 제거
      setImages((prevImages) => prevImages.filter((img) => img.id !== image.id));
      // 선택된 이미지에서도 제거
      setSelectedImages((prevSelected) => {
        const newSelected = new Set(prevSelected);
        newSelected.delete(image.id);
        return newSelected;
      });
      // 미리보기 중인 이미지가 삭제된 경우 모달 닫기
      if (previewImage?.id === image.id) {
        setPreviewImage(null);
      }
      showSuccessToast("이미지가 삭제되었습니다.");
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
      showErrorToast("이미지 삭제에 실패했습니다.");
    }
  };

  // 선택된 이미지들 삭제
  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) {
      showInfoToast("삭제할 이미지를 선택해주세요.");
      return;
    }

    const selectedImageItems = images.filter((img) => selectedImages.has(img.id));
    const imageNames = selectedImageItems.map((img) => img.name);
    const confirmed = await showMultiDeleteConfirm(selectedImages.size, imageNames);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await axiosInstance.delete("/files/images", {
        data: imageNames,
      });
      // 성공 시 이미지 목록에서 제거
      setImages((prevImages) => prevImages.filter((img) => !selectedImages.has(img.id)));
      // 미리보기 중인 이미지가 삭제된 경우 모달 닫기
      if (previewImage && selectedImages.has(previewImage.id)) {
        setPreviewImage(null);
      }
      // 선택 초기화
      setSelectedImages(new Set());
      setIsAllSelected(false);
      showSuccessToast(`${imageNames.length}개의 이미지가 삭제되었습니다.`);
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
      showErrorToast("이미지 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
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
          <div className="action-buttons">
            <button
              className="download-button"
              onClick={handleDownloadSelected}
              disabled={selectedImages.size === 0 || downloading || deleting}
            >
              {downloading ? "다운로드 중..." : `다운로드 (${selectedImages.size}개)`}
            </button>
            <button
              className="delete-button"
              onClick={handleDeleteSelected}
              disabled={selectedImages.size === 0 || downloading || deleting}
            >
              {deleting ? "삭제 중..." : `삭제 (${selectedImages.size}개)`}
            </button>
          </div>
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
                  <img
                    src={image.blobUrl || "/placeholder.svg"}
                    alt={image.name}
                    loading="lazy"
                    onClick={() => handleImagePreview(image)}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <div className="image-overlay">
                  <input
                    type="checkbox"
                    className="image-checkbox"
                    checked={selectedImages.has(image.id)}
                    onChange={() => handleImageSelect(image.id)}
                    disabled={image.loading || image.error || deleting}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {!image.loading && !image.error && (
                  <div className="image-actions">
                    <button
                      className="download-single-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image);
                      }}
                      title="이미지 다운로드"
                      disabled={deleting}
                    >
                      ⬇
                    </button>
                    <button
                      className="delete-single-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(image);
                      }}
                      title="이미지 삭제"
                      disabled={deleting}
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>
              <div className="image-name">{image.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* 이미지 미리보기 모달 */}
      {previewImage && (
        <div className="image-preview-modal" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-preview-header">
              <button className="image-preview-close" onClick={() => setPreviewImage(null)}>
                ✕
              </button>
            </div>

            <div className="image-preview-body">
              <button
                className="image-preview-nav image-preview-prev"
                onClick={handlePrevImage}
                disabled={images.filter((img) => !img.loading && !img.error).length <= 1}
              >
                ◀
              </button>

              <div className="image-preview-wrapper">
                <img
                  src={previewImage.blobUrl || "/placeholder.svg"}
                  alt={previewImage.name}
                  className="image-preview-img"
                />
              </div>

              <button
                className="image-preview-nav image-preview-next"
                onClick={handleNextImage}
                disabled={images.filter((img) => !img.loading && !img.error).length <= 1}
              >
                ▶
              </button>
            </div>

            <div className="image-preview-actions">
              <button className="image-preview-download" onClick={() => downloadImage(previewImage)}>
                다운로드
              </button>
              <button className="image-preview-delete" onClick={() => deleteImage(previewImage)}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
