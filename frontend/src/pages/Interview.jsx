import React, { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Mic, Video, Volume2, Square, Circle, Loader } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { initDB, storeVideo } from "../utils/indexedDB";

const Interview = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [deviceStatus, setDeviceStatus] = useState({
    microphone: null,
    speakers: null,
    camera: null,
  });
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [question, setQuestion] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { title } = location.state || {};
  // console.log(title)
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setDeviceStatus((prev) => ({ ...prev, microphone: true }));
      toast.success("Microphone connected successfully");
    } catch (error) {
      setDeviceStatus((prev) => ({ ...prev, microphone: false }));
      toast.error("Cannot connect to microphone");
    }
  };

  const generateSpeech = async (data) => {
    setLoading(true);
    const apiKey = "sk_cfd322d82956083e20bc611e4517127b0783a3280cb2f81d";
    const voiceId = "Xb7hH8MSUJpSbSDYk0k2";
    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          responseType: "blob",
        }
      );

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkSpeakers = async () => {
    try {
      setDeviceStatus((prev) => ({ ...prev, speakers: true }));
      toast.success("Speakers connected successfully");
    } catch (error) {
      setDeviceStatus((prev) => ({ ...prev, speakers: false }));
      toast.error("Cannot connect to speakers");
    }
  };

  const checkCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setDeviceStatus((prev) => ({ ...prev, camera: true }));
      toast.success("Camera connected successfully");
    } catch (error) {
      setDeviceStatus((prev) => ({ ...prev, camera: false }));
      toast.error("Cannot connect to Camera");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    setIsBlurred(true);
    try {
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });

      // Store the video in IndexedDB
      await storeVideo(currentQuestionIndex, videoBlob);

      // Store the question text
      setQuestions(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = question;
        localStorage.setItem('interviewQuestions', JSON.stringify(updated));
        return updated;
      });
      
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      formData.append("previous", question);
      formData.append("domain", `${title}`);

      const response = await fetch("https://plugin-5vmd.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit recording");
      }

      const result = await response.json();

      if (currentQuestionIndex === 2) {
        navigate("/feedback");
        return;
      }

      setQuestion(result);
      generateSpeech(result);
      setCurrentQuestionIndex((prev) => prev + 1);
      setRecordedChunks([]);
    } catch (error) {
      console.error("Error submitting recording:", error);
    } finally {
      setIsBlurred(false);
    }
  };

  const handleStartInterview = async () => {
    setIsInterviewStarted(true);
    setIsBlurred(true);
    try {
      const clear = await fetch('https://plugin-5vmd.onrender.com/clear', {
        method: 'GET',
      });
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }

      let formData = new FormData();
      formData.append("domain", `${title}`);

      const response = await fetch(
        "https://plugin-5vmd.onrender.com/FirstQuestion",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }

      const data = await response.json();
      setQuestion(data);
      generateSpeech(data);
    } catch (error) {
      console.error("Error:", error);
      setQuestion("Error loading question. Please try again.");
    } finally {
      setIsBlurred(false);
    }
  };

  const canStartInterview = Object.values(deviceStatus).every(
    (status) => status === true
  );

  useEffect(() => {
    if (isInterviewStarted) {
      const initializeCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error initializing camera:", error);
        }
      };
      initializeCamera();
    }
  }, [isInterviewStarted]);

  return (
    <div
      className={`${isInterviewStarted
          ? "h-screen w-screen p-0 bg-black"
          : "container mx-auto px-4 py-8 max-w-[90%]"
        }`}
    >
      {!isInterviewStarted && (
        <div className="text-center mb-8">
          <Toaster position="top-right" reverseOrder={false} />
          <h1 className="text-3xl font-bold mb-2">Technical Interview Setup</h1>
          <p className="text-gray-600">
            Let's ensure everything is working properly before we begin
          </p>
        </div>
      )}

      {isInterviewStarted ? (
        <div className="h-screen w-full flex">




          <div className="w-1/4 p-4 bg-gray-900">
            <Card className="h-full bg-black/70 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <h2 className="text-white text-xl font-semibold">
                  Question {currentQuestionIndex + 1}
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`p-4 bg-black/50 rounded-lg ${isBlurred ? "blur-sm" : ""
                    }`}
                >
                  <p className="text-white text-lg">{question}</p>
                </div>
                <div className="space-y-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className="w-full"
                    variant={isRecording ? "destructive" : "default"}
                    disabled={isBlurred}
                  >
                    {isRecording ? (
                      <Square className="w-4 h-4 mr-2" />
                    ) : (
                      <Circle className="w-4 h-4 mr-2 fill-current" />
                    )}
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                  <div className="relative z-10">
                    <Button
                      onClick={handleSubmit}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={recordedChunks.length === 0 || isBlurred}
                    >
                      Submit Answer
                    </Button>
                  </div>
                </div>
              </CardContent>
              {isBlurred && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10 rounded-lg">
                  <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
                </div>
              )}
            </Card>
          </div>








          <div className="w-3/4 bg-slate-900 p-4 rounded-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6 w-full">
          <Card className="w-full lg:w-[calc(90vw/2-1rem)]">
            <CardHeader>
              <h2 className="text-xl font-semibold">Camera Preview</h2>
            </CardHeader>
            <CardContent>
              <div className="relative bg-slate-900 aspect-video rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!deviceStatus.camera && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Video className="w-12 h-12 text-slate-600 mb-2" />
                    <p className="text-slate-400">Camera preview will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full lg:w-[calc(90vw/2-1rem)]">
            <CardHeader>
              <h2 className="text-xl font-semibold">System Check</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Mic className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Microphone</h3>
                    <p className="text-sm text-gray-500">
                      Required for voice communication
                    </p>
                  </div>
                </div>
                <Button
                  onClick={checkMicrophone}
                  variant={deviceStatus.microphone ? "default" : "secondary"}
                  className={
                    deviceStatus.microphone
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  Check Microphone
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Volume2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Speakers</h3>
                    <p className="text-sm text-gray-500">
                      Required for audio playback
                    </p>
                  </div>
                </div>
                <Button
                  onClick={checkSpeakers}
                  variant={deviceStatus.speakers ? "default" : "secondary"}
                  className={
                    deviceStatus.speakers
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  Check Speakers
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Video className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Camera</h3>
                    <p className="text-sm text-gray-500">
                      Required for video communication
                    </p>
                  </div>
                </div>
                <Button
                  onClick={checkCamera}
                  variant={deviceStatus.camera ? "default" : "secondary"}
                  className={
                    deviceStatus.camera
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }
                >
                  Check Camera
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isInterviewStarted && (
        <div className="mt-8">
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            size="lg"
            disabled={!canStartInterview || isBlurred}
            onClick={handleStartInterview}
          >
            Start Interview
          </Button>
        </div>
      )}
    </div>
  );
};

export default Interview;
