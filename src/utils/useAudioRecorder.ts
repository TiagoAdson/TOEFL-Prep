import { useCallback, useRef, useState } from 'react'

export interface AudioRecorder {
  recording: boolean
  audioBlob: Blob | null
  permissionDenied: boolean
  startRecording: () => Promise<boolean>  // resolves false if microphone permission was denied
  stopRecording: () => void
  reset: () => void
}

// Shared microphone recorder — used by both Simulado (Speaking section)
// and Exercise (daily Speaking practice). Records to WebM/Opus via MediaRecorder,
// same format already sent to Gemini in evaluateSpeakingAudio.
export function useAudioRecorder(): AudioRecorder {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      mediaRef.current = mr
      setRecording(true)
      setPermissionDenied(false)
      return true
    } catch {
      setPermissionDenied(true)
      return false
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRef.current?.stop()
    setRecording(false)
  }, [])

  const reset = useCallback(() => {
    setAudioBlob(null)
    setRecording(false)
  }, [])

  return { recording, audioBlob, permissionDenied, startRecording, stopRecording, reset }
}
