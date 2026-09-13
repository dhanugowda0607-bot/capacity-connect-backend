import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import Unauthorized from './pages/Unauthorized.jsx'

import TraineeDashboard from './pages/trainee/TraineeDashboard.jsx'
import TraineeProfile from './pages/trainee/TraineeProfile.jsx'
import Courses from './pages/trainee/Courses.jsx'
import CourseDetail from './pages/trainee/CourseDetail.jsx'
import Quiz from './pages/trainee/Quiz.jsx'
import Certificates from './pages/trainee/Certificates.jsx'

import TrainerDashboard from './pages/trainer/TrainerDashboard.jsx'
import TrainerProfile from './pages/trainer/TrainerProfile.jsx'
import ManageCourses from './pages/trainer/ManageCourses.jsx'
import QuestionBank from './pages/trainer/QuestionBank.jsx'
import Library from './pages/trainer/Library.jsx'

import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import VerificationQueue from './pages/admin/VerificationQueue.jsx'
import CompetencyMap from './pages/admin/CompetencyMap.jsx'
import Announcements from './pages/admin/Announcements.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Trainee — Phase 2 RBAC: only role "trainee" can reach these */}
      <Route path="/trainee" element={<ProtectedRoute roles={['trainee']}><TraineeDashboard /></ProtectedRoute>} />
      <Route path="/trainee/profile" element={<ProtectedRoute roles={['trainee']}><TraineeProfile /></ProtectedRoute>} />
      <Route path="/trainee/courses" element={<ProtectedRoute roles={['trainee']}><Courses /></ProtectedRoute>} />
      <Route path="/trainee/courses/:id" element={<ProtectedRoute roles={['trainee']}><CourseDetail /></ProtectedRoute>} />
      <Route path="/trainee/courses/:id/quiz" element={<ProtectedRoute roles={['trainee']}><Quiz /></ProtectedRoute>} />
      <Route path="/trainee/certificates" element={<ProtectedRoute roles={['trainee']}><Certificates /></ProtectedRoute>} />

      {/* Trainer */}
      <Route path="/trainer" element={<ProtectedRoute roles={['trainer']}><TrainerDashboard /></ProtectedRoute>} />
      <Route path="/trainer/profile" element={<ProtectedRoute roles={['trainer']}><TrainerProfile /></ProtectedRoute>} />
      <Route path="/trainer/courses" element={<ProtectedRoute roles={['trainer']}><ManageCourses /></ProtectedRoute>} />
      <Route path="/trainer/questions" element={<ProtectedRoute roles={['trainer']}><QuestionBank /></ProtectedRoute>} />
      <Route path="/trainer/library" element={<ProtectedRoute roles={['trainer']}><Library /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/verification" element={<ProtectedRoute roles={['admin']}><VerificationQueue /></ProtectedRoute>} />
      <Route path="/admin/competency" element={<ProtectedRoute roles={['admin']}><CompetencyMap /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute roles={['admin']}><Announcements /></ProtectedRoute>} />

      <Route path="*" element={<Home />} />
    </Routes>
  )
}
