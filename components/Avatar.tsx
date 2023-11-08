import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Alert, Image } from "react-native";
import { Button } from "react-native-elements";

import DocumentPicker, {
  isCancel,
  isInProgress,
  types,
} from "react-native-document-picker";

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const file = await DocumentPicker.pickSingle({
        presentationStyle: "fullScreen",
        copyTo: "cachesDirectory",
        type: types.images,
        mode: "open",
      });

      const photo = {
        uri: file.fileCopyUri,
        type: file.type,
        name: file.name,
      };

      const formData = new FormData();
      formData.append("file", photo);

      const fileExt = file.name.split(".").pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, formData);

      if (error) {
        throw error;
      }

      onUpload(filePath);
    } catch (error) {
      if (isCancel(error)) {
        console.warn("cancelled");
        // User cancelled the picker, exit any dialogs or menus and move on
      } else if (isInProgress(error)) {
        console.warn(
          "multiple pickers were opened, only the last will be considered"
        );
      } else if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <Image
          source={{
            uri: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
          }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      )}
      <View>
        <Button
          title={uploading ? "Uploading ..." : "Upload"}
          onPress={uploadAvatar}
          disabled={uploading}
          buttonStyle={{
            backgroundColor: "#3ECF8E",
            width: "100%",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 40,
  },
  avatar: {
    alignSelf: "center",
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
});
