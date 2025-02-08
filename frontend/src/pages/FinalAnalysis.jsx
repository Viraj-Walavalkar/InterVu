import React, { useEffect, useState } from 'react';
import ScoreCard from '../components/ScoreCard';
import SkillsRadarChart from '../components/SkillsRadarChart';
import SkillAnalysis from '../components/SkillAnalysis';
import KeyObservations from '../components/KeyObservations';
import Drawer from '../components/Drawer';
import VideoPlayer from '../components/VideoPlayer';
import { BarChart2, Brain, MessageCircle, Video } from 'lucide-react';
import { getVideo } from '../utils/indexedDB';

function FinalAnalysis() {
  const [apiData, setApiData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch API data
        const response = await fetch('https://plugin-5vmd.onrender.com/results');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setApiData(data);
        console.log(data);

        // Load questions from localStorage
        const questions = JSON.parse(localStorage.getItem('interviewQuestions') || '[]');

        // Load recordings from IndexedDB
        const videoPromises = [0, 1, 2].map(async (index) => {
          const blob = await getVideo(index);
          return blob ? { blob, question: questions[index] } : null;
        });

        const loadedRecordings = (await Promise.all(videoPromises)).filter(Boolean);
        setRecordings(loadedRecordings);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  if (!apiData) {
    return (
      <>
        <div class="sk-folding-cube-container">
          <div class="sk-folding-cube">
            <div class="sk-cube1 sk-cube"></div>
            <div class="sk-cube2 sk-cube"></div>
            <div class="sk-cube4 sk-cube"></div>
            <div class="sk-cube3 sk-cube"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed top-4 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
        aria-label="Open conversation"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={apiData}
      />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Interview Analysis
        </h1>







        <div className="mb-8">
          <div className='bg-white rounded-lg p-6 shadow-md'>


            <div className="flex items-center gap-2 mb-6 ">
              <Video className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Interview Recordings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recordings.map((recording, index) => (
                <VideoPlayer
                  key={index}
                  blob={recording.blob}
                  questionNumber={index + 1}
                  question={recording.question}
                />
              ))}
            </div>
          </div>
        </div>










        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ScoreCard
            title="Score"
            score={apiData.average_score}
            description="Overall interview performance"
            type="score"
          />
          <ScoreCard
            title="Problem Solving"
            score={apiData.problem_solving}
            description="Analytical and solution skills"
            type="problem"
          />
          <ScoreCard
            title="Communication"
            score={apiData.communication}
            description="Communication effectiveness"
            type="communication"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-6 h-6 text-indigo-700" />
              <h2 className="text-xl font-semibold text-gray-800">Skills Distribution</h2>
            </div>
            <SkillsRadarChart data={apiData?.skills} />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Skill Analysis</h2>
            </div>
            {apiData.skills ? (
              Object.entries(apiData.skills).map(([skill, score], index) => (
                <SkillAnalysis
                  key={index}
                  title={skill}
                  score={score}
                  description={skill.description}
                />
              ))
            ) : (
              <>
                <SkillAnalysis
                  title="Technical Knowledge"
                  score={85}
                  description="Strong understanding of core concepts"
                />
                <SkillAnalysis
                  title="Problem Solving"
                  score={80}
                  description="Good analytical and solution-finding abilities"
                />
                <SkillAnalysis
                  title="Communication"
                  score={75}
                  description="Clear and effective communication skills"
                />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-7">
          <KeyObservations data={apiData.observations} />
        </div>
      </div>
    </div>
  );
}

export default FinalAnalysis;