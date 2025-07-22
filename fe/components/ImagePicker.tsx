import React, { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import { ThemedButton } from "./ThemedButton";
import { ThemedInput } from "./ThemedInput";
import axiosInstance from "@/api/AxiosInstance";

type Props = {
  onImageSelected?: (uri: string) => void;
  formattedDate?: string;
};

const ImagePicker: React.FC<Props> = ({ onImageSelected, formattedDate }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imgInput, setImgInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<Asset | null>(null);

  const selectImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const uri = asset.uri || null;
        setImageUri(uri);
        setSelectedFile(asset);
        if (uri && onImageSelected) {
          onImageSelected(uri);
        }
      }
    });
  };

  const handleImageUpload = async () => {
    console.log(`${formattedDate}의 사진 업로드`);
    console.log("업로드 파일:", selectedFile);

    if (!imageUri || !selectedFile) {
      console.log("12321312");

      Alert.alert("알림", "업로드할 사진을 선택해주세요.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: selectedFile.uri,
        name: selectedFile.fileName || "upload.jpg",
        type: selectedFile.type || "image/jpeg",
      } as any);

      formData.append("description", imgInput);

      const response = await axiosInstance.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          //   Authorization: `Bearer ${token}`,
        },
      });

      console.log("사진 업로드 성공:", formData);
      alert("사진이 성공적으로 업로드되었습니다.");
    } catch (error) {
      console.error("사진 업로드 실패:", error);
      alert("사진 업로드에 실패했습니다. 다시 시도해주세요.");
    }
    setImageUri(null);
    setSelectedFile(null);
  };

  return (
    <View style={styles.container}>
      <ThemedButton title="사진 선택" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <ThemedInput
        onChangeText={setImgInput}
        value={imgInput}
        placeholder="설명을 입력하세요"
        keyboardType="default"
        style={{ marginTop: 12 }}
      />
      <ThemedButton title="사진 업로드" onPress={() => handleImageUpload()} disabled={!imageUri} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    maxHeight: 400,
    maxWidth: 400,
  },
  image: {
    width: "80%",
    height: "80%",
    marginTop: 20,
    borderRadius: 10,
  },
});

export default ImagePicker;
