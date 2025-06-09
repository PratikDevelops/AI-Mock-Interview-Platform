import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Dashboard from './Pages/Dashboard';

import DashboardOverview from './Components/DashboardOverview';
import ResumeAnalyzer from './Components/ResumeAnalyzer';
import CareerRoadmapGenerator from './Components/CareerRoadmapGenerator';
import CoverLetterGenerator from './Components/CoverLetterGenerator';
import CompanyOverview from './Components/CompanyOverview';
import ExpertBooking from './Components/ExpertBooking';
import InterviewQAGenerator from './Components/InterviewQAGenerator';
import SignupPage from './Authentication/SignupPage';
import NotFoundPage from './Pages/NotFoundPage';
import StudyMaterial from './Components/StudyMaterial';
import StudyMaterialDownload from './Components/StudyMaterial';
import FeedbackPage from './Pages/FeedbackPage';
import LearnMorePage from './Pages/LearnMorePage';
import AIVideoInterview from './Pages/AIInterviewPage';
import InterviewFormPage from './Pages/InterviewFormPage';
import CodePlayground from './Components/CodePlayground';
import JobSearch from './Components/JobSearch';
import ForgotPassword from './Authentication/ForgotPassword';
import PuzzleGame from './Components/PuzzleGame';



const App = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="career-roadmap" element={<CareerRoadmapGenerator />} />
          <Route path="cover-letter" element={<CoverLetterGenerator />} />
          <Route path="company-overview" element={<CompanyOverview />} />
          <Route path="expert-booking" element={<ExpertBooking />} />
          <Route path='interview-form' element={<InterviewFormPage/>}/>
          <Route path='start-interview' element={<AIVideoInterview/>}/>
          <Route path="interview-qa" element={<InterviewQAGenerator />} />
          <Route path='feedback' element={<FeedbackPage/>}/>
          <Route path='job-search'  element={<JobSearch/>}/>
          <Route path="study-material" element={<StudyMaterialDownload/>}/>
        </Route>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/code' element={<CodePlayground/>}/>
        <Route path='/job'  element={<JobSearch/>}/>
        <Route path='/learn-more' element={<LearnMorePage/>}/>
        <Route path='/puzzle' element={<PuzzleGame/>}/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );   d40f2c3890msh3d9bb282d466b53p1cbcdajsn5d6ac67109d1
};

export default App;
