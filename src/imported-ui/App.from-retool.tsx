import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

// Pages
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import Eligibility from './pages/Eligibility'
import PreSession from './pages/PreSession'
import Journal from './pages/Journal'
import Documentation from './pages/Documentation'
import ChargeCapture from './pages/ChargeCapture'
import Claims from './pages/Claims'
import PaymentPosting from './pages/PaymentPosting'
import Denials from './pages/Denials'
import Reporting from './pages/Reporting'
import Mailroom from './pages/Mailroom'
import Tasks from './pages/Tasks'
import Credentialing from './pages/Credentialing'
import PracticeManagement from './pages/PracticeManagement'
import PatientPortal from './pages/PatientPortal'
import PriorAuth from './pages/PriorAuth'
import NoteEditor from './pages/NoteEditor'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientDetail />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/pre-session" element={<PreSession />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/charge-capture" element={<ChargeCapture />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/payment-posting" element={<PaymentPosting />} />
        <Route path="/denials" element={<Denials />} />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/mailroom" element={<Mailroom />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/credentialing" element={<Credentialing />} />
        <Route path="/practice-management" element={<PracticeManagement />} />
        <Route path="/portal" element={<PatientPortal />} />
        <Route path="/prior-auth" element={<PriorAuth />} />
        <Route path="/notes/:id/edit" element={<NoteEditor />} />
        <Route path="/notes/new" element={<NoteEditor />} />
        {/* Catch-all */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </AppProvider>
  )
}
