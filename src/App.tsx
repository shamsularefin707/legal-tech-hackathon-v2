import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTabId } from './components/Sidebar';
import { ApplicantPortalView } from './components/ApplicantPortalView';
import { OfficerWorkspaceView } from './components/OfficerWorkspaceView';
import { LawyerWorkspaceView } from './components/LawyerWorkspaceView';
import { SupervisorOversightView } from './components/SupervisorOversightView';
import { ApplicationsView } from './components/ApplicationsView';
import { CaseExplorerView } from './components/CaseExplorerView';
import { LawyerIntelligenceView } from './components/LawyerIntelligenceView';
import { DistrictMonitoringView } from './components/DistrictMonitoringView';
import { SlaMonitoringView } from './components/SlaMonitoringView';
import { DataQualityView } from './components/DataQualityView';
import { AuditTrailView } from './components/AuditTrailView';
import { SecurityAdminView } from './components/SecurityAdminView';
import { CaseDetailModal } from './components/CaseDetailModal';
import { NewApplicationModal } from './components/NewApplicationModal';
import { NikahnamaPreviewModal } from './components/NikahnamaPreviewModal';
import { HackathonDemoTourModal } from './components/HackathonDemoTourModal';
import { legalAidStore } from './services/legalAidStore';
import { CanonicalCase, UserRole } from './types/legalAid';
import { FileCheck, LayoutDashboard, Briefcase, PlusCircle } from 'lucide-react';

export const App: React.FC = () => {
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('nlaso_theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nlaso_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // State subscriptions to live single source of truth
  const [, setTick] = useState(0);
  useEffect(() => {
    return legalAidStore.subscribe(() => setTick(t => t + 1));
  }, []);

  const cases = legalAidStore.getCases();
  const lawyers = legalAidStore.getLawyers();
  const currentUser = legalAidStore.getCurrentUser();
  const qualityReport = legalAidStore.getQualityReport();
  const districtMetrics = legalAidStore.getDistrictMetrics();

  // Navigation and Modals State
  const [activeTab, setActiveTab] = useState<NavTabId>('officer_workspace');
  const [selectedCase, setSelectedCase] = useState<CanonicalCase | null>(null);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [nikahnamaCase, setNikahnamaCase] = useState<CanonicalCase | null>(null);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Synchronize default tab on role switch
  const handleRoleChange = (role: UserRole) => {
    legalAidStore.setCurrentRole(role);
    if (role === 'CITIZEN') {
      setActiveTab('applicant_portal');
    } else if (role === 'LEGAL_AID_OFFICER') {
      setActiveTab('officer_workspace');
    } else if (role === 'PANEL_LAWYER') {
      setActiveTab('lawyer_workspace');
    } else {
      setActiveTab('supervisor_workspace');
    }
  };

  const handleResetDemo = () => {
    legalAidStore.resetToDefault();
    setSelectedCase(null);
  };

  const handleCaseSelect = (c: CanonicalCase) => {
    setSelectedCase(c);
  };

  // Badge Counts for Sidebar
  const pendingApplicationsCount = cases.filter(
    c => c.applicationStatus === 'SUBMITTED' || c.applicationStatus === 'UNDER_REVIEW'
  ).length;

  const activeCasesCount = cases.filter(
    c => c.lifecycleStatus !== 'CLOSED' && c.lifecycleStatus !== 'RESOLVED'
  ).length;

  const attentionItemsCount = cases.filter(
    c =>
      c.chronologyStatus === 'FAILED' ||
      c.isChronologyInvalid ||
      c.slaStatus === 'EXPIRED' ||
      (c.lifecycleStatus === 'ONGOING' && !c.assignedLawyerId)
  ).length;

  const slaBreachesCount = cases.filter(c => c.slaStatus === 'EXPIRED').length;
  const dataAnomaliesCount = qualityReport.totalAnomaliesCount;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] dark:bg-[#0B131E] text-slate-900 dark:text-slate-100">
      {/* 1. Official Header */}
      <Header
        currentRole={currentUser.role}
        userName={currentUser.name}
        userDesignation={currentUser.designation}
        theme={theme}
        onToggleTheme={toggleTheme}
        onRoleChange={handleRoleChange}
        onResetDemo={handleResetDemo}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto pb-16 lg:pb-0">
        {/* Role-Aware Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentRole={currentUser.role}
          pendingApplicationsCount={pendingApplicationsCount}
          activeCasesCount={activeCasesCount}
          attentionItemsCount={attentionItemsCount}
          slaBreachesCount={slaBreachesCount}
          dataAnomaliesCount={dataAnomaliesCount}
          onOpenNewApplicationModal={() => setIsNewAppModalOpen(true)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Main Stage View */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-x-hidden">
          {/* A. Citizen / Applicant Portal */}
          {activeTab === 'applicant_portal' && (
            <ApplicantPortalView
              cases={cases}
              onOpenNewApplication={() => setIsNewAppModalOpen(true)}
              onSelectCase={handleCaseSelect}
            />
          )}

          {/* B. District Legal Aid Officer (DLAO) Workspace */}
          {activeTab === 'officer_workspace' && (
            <OfficerWorkspaceView
              cases={cases}
              lawyers={lawyers}
              currentRole={currentUser.role}
              currentDistrict={currentUser.district}
              onSelectCase={handleCaseSelect}
              onOpenNewApplication={() => setIsNewAppModalOpen(true)}
              onOpenNikahnamaPreview={c => setNikahnamaCase(c)}
            />
          )}

          {/* C. Panel Lawyer Practice Workspace */}
          {activeTab === 'lawyer_workspace' && (
            <LawyerWorkspaceView
              cases={cases}
              lawyers={lawyers}
              currentRole={currentUser.role}
              currentLawyerId="LADCS-004"
              onSelectCase={handleCaseSelect}
              onOpenNikahnamaPreview={c => setNikahnamaCase(c)}
            />
          )}

          {/* D. Judicial & Administrative Supervisor Oversight */}
          {activeTab === 'supervisor_workspace' && (
            <SupervisorOversightView
              cases={cases}
              lawyers={lawyers}
              districtMetrics={districtMetrics}
              currentRole={currentUser.role}
              onSelectCase={handleCaseSelect}
            />
          )}

          {/* Secondary Domain Views (Preserving 100% Functionality) */}
          {activeTab === 'applications' && (
            <ApplicationsView
              cases={cases}
              currentRole={currentUser.role}
              onSelectCase={handleCaseSelect}
              onOpenNewApplicationModal={() => setIsNewAppModalOpen(true)}
            />
          )}

          {activeTab === 'cases' && (
            <CaseExplorerView
              cases={cases}
              currentRole={currentUser.role}
              onSelectCase={handleCaseSelect}
            />
          )}

          {activeTab === 'lawyers' && (
            <LawyerIntelligenceView
              lawyers={lawyers}
              currentRole={currentUser.role}
            />
          )}

          {activeTab === 'districts' && (
            <DistrictMonitoringView
              districtMetrics={districtMetrics}
              cases={cases}
              currentRole={currentUser.role}
              onSelectCase={handleCaseSelect}
            />
          )}

          {activeTab === 'sla' && (
            <SlaMonitoringView
              cases={cases}
              currentRole={currentUser.role}
              onSelectCase={handleCaseSelect}
            />
          )}

          {activeTab === 'data_quality' && (
            <DataQualityView
              cases={cases}
              qualityReport={qualityReport}
              currentRole={currentUser.role}
              onSelectCase={handleCaseSelect}
            />
          )}

          {activeTab === 'audit' && (
            <AuditTrailView currentRole={currentUser.role} />
          )}

          {activeTab === 'security' && (
            <SecurityAdminView
              currentRole={currentUser.role}
              onRefresh={() => setTick(t => t + 1)}
            />
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Action Bar (Reachable, clean touch targets) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#15202E] border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around text-xs shadow-lg">
        {currentUser.role === 'CITIZEN' ? (
          <>
            <button
              onClick={() => setActiveTab('applicant_portal')}
              className={`flex flex-col items-center gap-1 font-medium ${
                activeTab === 'applicant_portal' ? 'text-[#006A4E] dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>আমার মামলা</span>
            </button>
            <button
              onClick={() => setIsNewAppModalOpen(true)}
              className="flex flex-col items-center gap-1 font-semibold text-[#006A4E] dark:text-emerald-400"
            >
              <PlusCircle className="w-5 h-5" />
              <span>নতুন আবেদন</span>
            </button>
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="flex flex-col items-center gap-1 font-medium text-amber-700 dark:text-amber-400"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ডেমো গাইড</span>
            </button>
          </>
        ) : currentUser.role === 'LEGAL_AID_OFFICER' ? (
          <>
            <button
              onClick={() => setActiveTab('officer_workspace')}
              className={`flex flex-col items-center gap-1 font-medium ${
                activeTab === 'officer_workspace' ? 'text-[#006A4E] dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>করণীয় ডেস্ক</span>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex flex-col items-center gap-1 font-medium ${
                activeTab === 'applications' ? 'text-[#006A4E] dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>আবেদন যাচাই</span>
            </button>
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="flex flex-col items-center gap-1 font-medium text-amber-700 dark:text-amber-400"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ডেমো গাইড</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                if (currentUser.role === 'PANEL_LAWYER') setActiveTab('lawyer_workspace');
                else setActiveTab('supervisor_workspace');
              }}
              className="flex flex-col items-center gap-1 font-semibold text-[#006A4E] dark:text-emerald-400"
            >
              <Briefcase className="w-4 h-4" />
              <span>মূল ডেস্ক</span>
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className="flex flex-col items-center gap-1 font-medium text-slate-600 dark:text-slate-400"
            >
              <FileCheck className="w-4 h-4" />
              <span>মামলা খতিয়ান</span>
            </button>
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="flex flex-col items-center gap-1 font-medium text-amber-700 dark:text-amber-400"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ডেমো গাইড</span>
            </button>
          </>
        )}
      </div>

      {/* 4. Shared Case Dossier Modal */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          lawyers={lawyers}
          currentRole={currentUser.role}
          onClose={() => setSelectedCase(null)}
          onRefresh={() => setTick(t => t + 1)}
          onOpenNikahnamaPreview={c => setNikahnamaCase(c)}
        />
      )}

      {/* 5. New Application Intake Modal */}
      {isNewAppModalOpen && (
        <NewApplicationModal
          onClose={() => setIsNewAppModalOpen(false)}
          onSuccess={caseId => {
            const created = cases.find(c => c.caseId === caseId);
            if (created) setSelectedCase(created);
            setIsNewAppModalOpen(false);
          }}
        />
      )}

      {/* 6. Privacy-Masked Nikahnama Document Preview Modal */}
      {nikahnamaCase && (
        <NikahnamaPreviewModal
          caseItem={nikahnamaCase}
          onClose={() => setNikahnamaCase(null)}
        />
      )}

      {/* 7. Hackathon 10-Step Interactive Demo Guide */}
      {isDemoTourOpen && (
        <HackathonDemoTourModal
          isOpen={isDemoTourOpen}
          onClose={() => setIsDemoTourOpen(false)}
          onSwitchRole={handleRoleChange}
          onOpenNewApplication={() => setIsNewAppModalOpen(true)}
          onSelectCase={handleCaseSelect}
          cases={cases}
        />
      )}
    </div>
  );
};

export default App;
