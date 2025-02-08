import React from "react";
import { useNavigate } from "react-router-dom";
import { AudioWaveformIcon as WaveformIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useTypingEffect } from "../hooks/useTypingEffect";

const interviews = [
  {
    title: "AI/ML Interview",
    category: "AI-ML",
    vacancies: 56,
    duration: "10m",
    difficulty: "Medium",
  },
  {
    title: "Product Manager Interview",
    category: "Product-Manager",
    vacancies: 29,
    duration: "10m",
    difficulty: "Medium",
  },
  {
    title: "System Design Interview",
    category: "System-Design",
    vacancies: 13,
    duration: "10m",
    difficulty: "Medium",
  },
];

const Domain = () => {
  const typedText = useTypingEffect("Technical Interview", 100);
  const navigate = useNavigate();

  const handleStartInterview = async (title) => {
    const response = await fetch('https://plugin-5vmd.onrender.com/clear', {
      method: 'GET',
    });
    console.log(response);
    navigate("/interview", { state: { title } });
  };

  return (
    <div className="container mx-auto px-8 py-12 mt-15">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1
          className="text-6xl font-bold text-indigo-600 mb-4 min-h-[1.2em]"
          aria-label="Technical Interview"
        >
          {typedText}
          <span className="animate-blink">|</span>
        </h1>
        <p className="text-lg">
          Comprehensive collection of real-world technical challenges.
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((interview, index) => (
          <div
            key={index}
            className="relative transition-transform transform hover:scale-105 hover:border-indigo-600 border border-transparent rounded-lg aspect-w-1 aspect-h-1 bg-card"
          >
            {/* Card Header */}
            <Card className="flex flex-col justify-between h-full">
              <CardHeader className="space-y-0 p-6">
                <div className="flex justify-between items-center">
                  <WaveformIcon className="h-8 w-8 text-indigo-600" />
                  <Badge variant="secondary">{interview.category}</Badge>
                </div>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-black mb-4">{interview.title}</h2>
                <p className="text-black mb-4">Vacancy - {interview.vacancies}</p>
                <div className="flex items-center justify-between">
                  <span className="text-black">{interview.duration}</span>
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                    {interview.difficulty}
                  </Badge>
                </div>
              </CardContent>

              {/* Card Footer */}
              <CardFooter className="p-6">
                <Button
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  onClick={() => handleStartInterview(interview.category)}
                >
                  Start Interview
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Domain;
