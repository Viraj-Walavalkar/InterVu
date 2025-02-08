import React from 'react';
import { Calendar, Star, TrendingUp, Award, Clock, ArrowRight, BarChart2 } from 'lucide-react';

function Profile() {
  // Mock data for past interviews
  const pastInterviews = [
    {
      id: 1,
      date: '2024-03-15',
      position: 'Senior Frontend Developer',
      company: 'Tech Corp',
      scores: {
        overall: 85,
        technical: 88,
        communication: 82,
        problemSolving: 85
      },
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-03-10',
      position: 'Full Stack Engineer',
      company: 'Innovation Labs',
      scores: {
        overall: 78,
        technical: 80,
        communication: 75,
        problemSolving: 79
      },
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-03-05',
      position: 'React Developer',
      company: 'Digital Solutions',
      scores: {
        overall: 92,
        technical: 95,
        communication: 88,
        problemSolving: 93
      },
      status: 'Completed'
    }
  ];

  // Calculate average scores
  const averageScores = pastInterviews.reduce((acc, interview) => {
    acc.overall += interview.scores.overall;
    acc.technical += interview.scores.technical;
    acc.communication += interview.scores.communication;
    acc.problemSolving += interview.scores.problemSolving;
    return acc;
  }, { overall: 0, technical: 0, communication: 0, problemSolving: 0 });

  Object.keys(averageScores).forEach(key => {
    averageScores[key] = Math.round(averageScores[key] / pastInterviews.length);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Profile Header */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold">
              JD
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">John Doe</h1>
              <p className="text-indigo-200 mb-4">Frontend Developer</p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined March 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>{pastInterviews.length} Interviews Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Performance Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Performance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Overall Score</span>
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{averageScores.overall}%</div>
              <div className="mt-2 text-sm text-gray-500">Average performance</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Technical</span>
                <BarChart2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{averageScores.technical}%</div>
              <div className="mt-2 text-sm text-gray-500">Technical skills</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Communication</span>
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{averageScores.communication}%</div>
              <div className="mt-2 text-sm text-gray-500">Communication skills</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Problem Solving</span>
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{averageScores.problemSolving}%</div>
              <div className="mt-2 text-sm text-gray-500">Problem-solving ability</div>
            </div>
          </div>
        </div>

        {/* Interview History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" />
            Interview History
          </h2>
          <div className="space-y-6">
            {pastInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{interview.position}</h3>
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        {interview.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{interview.company}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(interview.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="min-w-[100px]">
                      <div className="text-sm text-gray-600 mb-1">Overall</div>
                      <div className="text-2xl font-bold text-gray-900">{interview.scores.overall}%</div>
                    </div>
                    <div className="min-w-[100px]">
                      <div className="text-sm text-gray-600 mb-1">Technical</div>
                      <div className="text-2xl font-bold text-gray-900">{interview.scores.technical}%</div>
                    </div>
                    <div className="min-w-[100px]">
                      <div className="text-sm text-gray-600 mb-1">Communication</div>
                      <div className="text-2xl font-bold text-gray-900">{interview.scores.communication}%</div>
                    </div>
                    <div className="min-w-[100px]">
                      <div className="text-sm text-gray-600 mb-1">Problem Solving</div>
                      <div className="text-2xl font-bold text-gray-900">{interview.scores.problemSolving}%</div>
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                    onClick={() => console.log('View details for interview', interview.id)}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
