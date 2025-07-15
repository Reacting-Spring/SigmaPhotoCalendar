import React, { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { ThemedButton } from "./ThemedButton";
import { ThemedInput } from "./ThemedInput";

type Props = {
    onImageSelected?: (uri: string) => void;
    formattedDate?: string;
};

const ImagePicker: React.FC<Props> = ({ onImageSelected, formattedDate }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imgInput, setImgInput] = useState("");

    const selectImage = () => {
        launchImageLibrary({ mediaType: "photo" }, (response) => {
            if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri || null;
                setImageUri(uri);
                if (uri && onImageSelected) {
                    onImageSelected(uri);
                }
            }
        });
    };

    const handleImageUpload = async() => {
        console.log(`${formattedDate}의 사진 업로드`);
        if (!imageUri) {
            Alert.alert("알림", "업로드할 사진을 선택해주세요.")
            return;
        }
        try {
            const fileType = response.assets[0].type
            console.log("사진 업로드 성공:", formData);
            alert("사진이 성공적으로 업로드되었습니다.");
        } catch (error) {
            console.error("사진 업로드 실패:", error);
            alert("사진 업로드에 실패했습니다. 다시 시도해주세요.");
        }
        setImageUri(null);
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
