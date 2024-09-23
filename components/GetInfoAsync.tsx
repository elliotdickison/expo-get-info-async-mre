import { Pressable, StyleSheet, Text } from 'react-native';
import { createDownloadResumable, documentDirectory, getInfoAsync } from 'expo-file-system'
import { useCallback, useState } from 'react';

// Big Buck Bunny (~350MB)
const FILE_URL = 'https://download.blender.org/demo/movies/BBB/bbb_sunflower_1080p_60fps_normal.mp4.zip'
const FILE_NAME = "big-buck-bunny.mp4.zip"
const FILE_PATH = documentDirectory + FILE_NAME

export function GetInfoAsync() {
  const [state, setState] = useState<"idle" | "downloading" | "downloaded">("idle")
  const [progress, setProgress] = useState<number>(0)

  const downloadFile = useCallback(async () => {
    setState("downloading")
    await createDownloadResumable(
      FILE_URL,
      FILE_PATH,
      {},
      (progress) => setProgress(progress.totalBytesWritten / progress.totalBytesExpectedToWrite)
    ).downloadAsync()
    setState("downloaded")
  }, [])

  
  const getInfoAboutFile = useCallback(async () => {
    const result = await getInfoAsync(FILE_PATH)
    console.log("Result", result)
  }, [])

  switch (state) {
    case "idle":
      return (
        <Pressable onPress={downloadFile}>
          <Text>Tap here to download a very large file</Text>
        </Pressable>
      )
    case "downloading":
      return <Text>Downloading... {Math.round(progress * 100)}%</Text>
    default:
      return (
        <Pressable onPress={getInfoAboutFile}>
          <Text>Tap here to run getInfoAsync and spike RAM</Text>
        </Pressable>
      )
  }
}
