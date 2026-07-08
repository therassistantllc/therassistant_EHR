import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserRole } from '../types/rcm'

interface DemoUser {
  id: string
  name: string
  email: string
  role: UserRole
  practiceId: string
  practiceName: string
  billingCompanyId?: string
  billingCompanyName?: string
  credentials?: string
}

const DEMO_USERS: DemoUser[] = [
  {
    id: 'u1',
    name: 'Sarah Mitchell, LCSW',
    email: 'sarah.mitchell@mountainmindcolorado.com',
    role: 'clinician',
    practiceId: 'p1',
    practiceName: 'Mountain Mind Wellness',
    credentials: 'LCSW',
  },
  {
    id: 'u2',
    name: 'James Torres',
    email: 'james@coloradobilling.com',
    role: 'biller',
    practiceId: 'p1',
    practiceName: 'Mountain Mind Wellness',
    billingCompanyId: 'bc1',
    billingCompanyName: 'Colorado Behavioral Billing Group',
  },
  {
    id: 'u3',
    name: 'Danielle Park',
    email: 'dpark@mountainmindcolorado.com',
    role: 'practice_admin',
    practiceId: 'p1',
    practiceName: 'Mountain Mind Wellness',
  },
  {
    id: 'u4',
    name: 'Marcus Webb',
    email: 'marcus@coloradobilling.com',
    role: 'billing_company_admin',
    practiceId: 'p1',
    practiceName: 'Mountain Mind Wellness',
    billingCompanyId: 'bc1',
    billingCompanyName: 'Colorado Behavioral Billing Group',
  },
  {
    id: 'u5',
    name: 'Tanya Reid',
    email: 'tanya@mountainmindcolorado.com',
    role: 'front_desk',
    practiceId: 'p1',
    practiceName: 'Mountain Mind Wellness',
  },
  {
    id: 'u6',
    name: 'Alex Johnson (Patient)',
    email: 'alex.johnson@gmail.com',
    role: 'patient',
    practiceId: 'p1',
    practiceName: 'Mountain Mind Wellness',
  },
  {
    id: 'u7',
    name: 'Platform Admin',
    email: 'admin@therassistant.com',
    role: 'platform_admin',
    practiceId: 'p1',
    practiceName: 'All Practices',
  },
]

interface AppContextValue {
  currentUser: DemoUser
  setCurrentUser: (user: DemoUser) => void
  demoUsers: DemoUser[]
  isPatientPortal: boolean
  setIsPatientPortal: (val: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser>(DEMO_USERS[1]!) // default: biller
  const [isPatientPortal, setIsPatientPortal] = useState(false)

  return (
    <AppContext.Provider
      value={{ currentUser, setCurrentUser, demoUsers: DEMO_USERS, isPatientPortal, setIsPatientPortal }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export { DEMO_USERS }
export type { DemoUser }

// Role permission helpers
export function canViewBilling(role: UserRole): boolean {
  return ['platform_admin', 'billing_company_admin', 'practice_admin', 'biller'].includes(role)
}

export function canViewClinical(role: UserRole): boolean {
  return ['platform_admin', 'billing_company_admin', 'practice_admin', 'clinician', 'biller'].includes(role)
}

export function canManagePractice(role: UserRole): boolean {
  return ['platform_admin', 'billing_company_admin', 'practice_admin'].includes(role)
}

export function canViewAllPractices(role: UserRole): boolean {
  return ['platform_admin', 'billing_company_admin'].includes(role)
}

export function isPatientRole(role: UserRole): boolean {
  return role === 'patient'
}

export const ROLE_LABELS: Record<UserRole, string> = {
  platform_admin: 'Platform Admin',
  billing_company_admin: 'Billing Company Admin',
  practice_admin: 'Practice Admin',
  clinician: 'Clinician',
  biller: 'Biller',
  front_desk: 'Front Desk',
  patient: 'Patient',
}
