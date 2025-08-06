import React, { useState, useRef, useEffect } from "react";
import { ThemedButton } from "./ThemedButton";
import axiosInstance from "../api/AxiosInstance";
import { showErrorToast, showSuccessToast } from "./Toast";
import "../css/ImagePicker.css";

type Props = {
  onImageSelected?: (uris: string[]) => void;
  formattedDate?: string;
};

const ImagePicker: React.FC<Props> = ({ onImageSelected, formattedDate }) => {
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const selectFromGallery = () => {
    fileInputRef.current?.click();
  };

  const selectFromCamera = () => {
    cameraInputRef.current?.click();
  };

  // 컴포넌트 언마운트 시 메모리 정리
  useEffect(() => {
    return () => {
      imageUris.forEach((uri) => {
        URL.revokeObjectURL(uri);
      });
    };
  }, [imageUris]);

  const handleGalleryFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // 기존 URI들 정리
      imageUris.forEach((uri) => {
        URL.revokeObjectURL(uri);
      });

      const newFiles = Array.from(files);
      const newUris = newFiles.map((file) => URL.createObjectURL(file));

      setSelectedFiles(newFiles);
      setImageUris(newUris);

      if (onImageSelected) {
        onImageSelected(newUris);
      }
    }
  };

  const handleCameraFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 기존 URI들 정리
      imageUris.forEach((uri) => {
        URL.revokeObjectURL(uri);
      });

      const uri = URL.createObjectURL(file);
      setSelectedFiles([file]);
      setImageUris([uri]);

      if (onImageSelected) {
        onImageSelected([uri]);
      }
    }
  };

  const removeImage = (index: number) => {
    // 제거할 URI 정리
    URL.revokeObjectURL(imageUris[index]);

    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUris = imageUris.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setImageUris(newUris);

    if (onImageSelected) {
      onImageSelected(newUris);
    }
  };

  const handleImageUpload = async () => {
    console.log(`${formattedDate}의 사진 업로드`);
    if (selectedFiles.length === 0) {
      showErrorToast("업로드할 사진을 선택해주세요.");
      return;
    }

    try {
      const formData = new FormData();

      // 여러 이미지를 images 키로 추가
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("date", formattedDate ?? "");

      await axiosInstance.post("/files/upload", formData);
      showSuccessToast(`${selectedFiles.length}장의 사진이 성공적으로 업로드되었습니다.`);
    } catch (error: any) {
      if (error.response?.status === 413) {
        showErrorToast("이미지 용량이 너무 큽니다. 더 작은 이미지를 선택해주세요.");
      } else {
        showErrorToast("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      }
    }

    // 메모리 정리
    imageUris.forEach((uri) => {
      URL.revokeObjectURL(uri);
    });

    setImageUris([]);
    setSelectedFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  return (
    <div className="image-picker-container">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryFileChange}
        className="image-picker-hidden-input"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraFileChange}
        className="image-picker-hidden-input"
      />

      <div className="image-picker-button-container">
        <ThemedButton title="갤러리에서 선택" onPress={selectFromGallery} className="image-picker-select-button" />
        <ThemedButton title="카메라로 촬영" onPress={selectFromCamera} className="image-picker-select-button" />
      </div>

      {imageUris.length > 0 ? (
        <div className="image-picker-images-container">
          <div className="image-picker-images-count">선택된 이미지: {imageUris.length}장</div>
          <div className="image-picker-images-grid">
            {imageUris.map((uri, index) => (
              <div key={index} className="image-picker-image-item">
                <img
                  src={uri || "/placeholder.svg"}
                  alt={`선택된 이미지 ${index + 1}`}
                  className="image-picker-image"
                />
                <button onClick={() => removeImage(index)} className="image-picker-remove-button" type="button">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="image-picker-no-image-container">
          <div className="image-picker-no-image-icon">📷</div>
          <div className="image-picker-no-image-text">이미지를 선택해주세요</div>
        </div>
      )}

      <ThemedButton
        title={`사진 업로드 ${selectedFiles.length > 0 ? `(${selectedFiles.length}장)` : ""}`}
        onPress={handleImageUpload}
        disabled={selectedFiles.length === 0}
        className="image-picker-upload-button"
      />
    </div>
  );
};

export default ImagePicker;
