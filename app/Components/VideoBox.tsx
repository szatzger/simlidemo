import { useEffect, useRef, useState } from 'react';
import { useMediaTrack } from '@daily-co/daily-react';

interface VideoBoxProps {
  id?: string;
  video?: React.RefObject<HTMLVideoElement>;
  audio?: React.RefObject<HTMLAudioElement>;
}

export default function VideoBox({ id, video, audio }: VideoBoxProps) {
  // Ha id meg van adva, akkor a Daily.co API-t használjuk
  if (id) {
    const videoTrack = useMediaTrack(id, 'video');
    const audioTrack = useMediaTrack(id, 'audio');

    const [videoSrcObjectSet, setVideoSrcObjectSet] = useState(false);
    const [audioSrcObjectSet, setAudioSrcObjectSet] = useState(false);

    const videoElement = useRef<any>(null);
    const audioElement = useRef<any>(null);

    useEffect(() => {
      const videoRef = videoElement.current;

      if (videoRef && videoTrack?.track && !videoSrcObjectSet) {
        videoRef.srcObject = new MediaStream([videoTrack.track]);
        setVideoSrcObjectSet(true);
      }
    }, [videoTrack, videoSrcObjectSet]);

    useEffect(() => {
      const audioRef = audioElement.current;

      if (audioRef && audioTrack?.persistentTrack && !audioSrcObjectSet) {
        audioRef.srcObject = new MediaStream([audioTrack.persistentTrack]);
        setAudioSrcObjectSet(true);
      }
    }, [audioTrack, audioSrcObjectSet]);

    return (
      <div className="aspect-video flex rounded-sm overflow-hidden items-center h-[350px] w-[350px] justify-center bg-simligray">
        {videoTrack && <video autoPlay muted playsInline ref={videoElement} />}
        {audioTrack && <audio autoPlay playsInline ref={audioElement} />}
      </div>
    );
  }
  
  // Ha video és audio ref-ek vannak megadva, akkor a régi módot használjuk (SimliOpenAI)
  return (
    <div className="aspect-video flex rounded-sm overflow-hidden items-center h-[350px] w-[350px] justify-center bg-simligray">
      {video && <video ref={video} autoPlay playsInline></video>}
      {audio && <audio ref={audio} autoPlay></audio>}
    </div>
  );
}