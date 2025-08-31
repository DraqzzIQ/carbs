import { Platform } from "react-native";
import {
  EncodingType,
  readAsStringAsync,
  StorageAccessFramework,
  writeAsStringAsync,
} from "expo-file-system";
import { shareAsync } from "expo-sharing";
import * as ExpoFileSystem from "expo-file-system";
import * as ExpoDocumentPicker from "expo-document-picker";

const DB_LOCATION = ExpoFileSystem.documentDirectory + "SQLite/food.db";
const SQLITE3_MIME_TYPE = "application/octet-stream";

export async function exportDbAsync(): Promise<void> {
  await saveFileToLocalStorageAsync(DB_LOCATION, "food.db", SQLITE3_MIME_TYPE);
}

export async function importDbAsync(): Promise<boolean> {
  const dbFile = await ExpoDocumentPicker.getDocumentAsync({
    type: SQLITE3_MIME_TYPE,
  });
  if (dbFile.canceled || !dbFile.assets[0]) {
    return false;
  }
  await copyFileAsync(dbFile.assets[0].uri, DB_LOCATION);
  return true;
}

export async function saveFileToLocalStorageAsync(
  filePath: string,
  fileName: string,
  mimeType: string,
): Promise<void> {
  if (Platform.OS === "android") {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permissions.granted) {
      const base64 = await readAsStringAsync(filePath, {
        encoding: EncodingType.Base64,
      });

      await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        mimeType,
      )
        .then(async (uri) => {
          await writeAsStringAsync(uri, base64, {
            encoding: EncodingType.Base64,
          });
        })
        .catch((e) => console.error(e));
    } else {
      await shareAsync(filePath);
    }
  } else {
    await shareAsync(filePath);
  }
}

export async function copyFileAsync(
  source: string,
  destination: string,
): Promise<void> {
  try {
    await ExpoFileSystem.copyAsync({
      from: source,
      to: destination,
    });
  } catch (error) {
    console.error("Error copying file:", error);
  }
}
