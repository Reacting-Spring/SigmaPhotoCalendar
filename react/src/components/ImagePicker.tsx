import React, { useState, useRef, useEffect } from "react";
import { ThemedButton } from "./ThemedButton";
import axiosInstance from "../api/AxiosInstance";
import { showErrorToast, showSuccessToast } from "./Toast";
import "../css/ImagePicker.css";

type Props = {
  onImageSelected?: (uri: string) => void;
  formattedDate?: string;
};

const ImagePicker: React.FC<Props> = ({ onImageSelected, formattedDate }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      if (imageUri) {
        URL.revokeObjectURL(imageUri);
      }
    };
  }, [imageUri]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const uri = URL.createObjectURL(file);
      setImageUri(uri);
      if (onImageSelected) {
        onImageSelected(uri);
      }
    }
  };

  const handleImageUpload = async () => {
    console.log(`${formattedDate}의 사진 업로드`);

    if (!selectedFile) {
      showErrorToast("업로드할 사진을 선택해주세요.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("date", formattedDate ?? "");

      await axiosInstance.post("/files/upload", formData);
      showSuccessToast("사진이 성공적으로 업로드되었습니다.");
    } catch (error: any) {
      if (error.response?.status === 413) {
        showErrorToast("이미지 용량이 너무 큽니다. 더 작은 이미지를 선택해주세요.");
      } else {
        showErrorToast("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      }
    }

    // 메모리 정리
    if (imageUri) {
      URL.revokeObjectURL(imageUri);
    }
    setImageUri(null);
    setSelectedFile(null);
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
        onChange={handleFileChange}
        className="image-picker-hidden-input"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="image-picker-hidden-input"
      />
      <div className="image-picker-button-container">
        <ThemedButton title="갤러리에서 선택" onPress={selectFromGallery} className="image-picker-select-button" />
        <ThemedButton title="카메라로 촬영" onPress={selectFromCamera} className="image-picker-select-button" />
      </div>
      {imageUri ? (
        <img src={imageUri} alt="선택된 이미지" className="image-picker-image" />
      ) : (
        <div className="image-picker-no-image-container">
          <div className="image-picker-no-image-icon">📷</div>
          <div className="image-picker-no-image-text">이미지를 선택해주세요</div>
        </div>
      )}
      <ThemedButton
        title="사진 업로드"
        onPress={handleImageUpload}
        disabled={!selectedFile}
        className="image-picker-upload-button"
      />
    </div>
  );
};

export default ImagePicker;
