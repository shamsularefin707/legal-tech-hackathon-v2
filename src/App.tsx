import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTabId } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ApplicationsView } from './components/ApplicationsView';
import { CaseExplorerView } from './components/CaseExplorerView';
import { AttentionTodayQueue } from './components/AttentionTodayQueue';
import { LawyerIntelligenceView } from './components/LawyerIntelligenceView';
import { DistrictMonitoringView } from './components/DistrictMonitoringView';
import { SlaMonitoringView } from './components/SlaMonitoringView';
import { DataQualityView } from './components/DataQualityView';
import { AuditTrailView } from './components/AuditTrailView';
import { SecurityAdminView } from './components/SecurityAdminView';
import { CaseDetailModal } from './components/CaseDetailModal';
import { NewApplicationModal } from './components/NewApplicationModal';
import { NikahnamaPreviewModal } from './components/NikahnamaPreviewModal';
import { legalAidStore } from './services/legalAidStore';
import { CanonicalCase, UserRole } from './types/legalAid';

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
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [selectedCase, setSelectedCase] = useState<CanonicalCase | null>(null);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [nikahnamaCase, setNikahnamaCase] = useState<CanonicalCase | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Badge Counts
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

  const handleRoleChange = (role: UserRole) => {
    legalAidStore.setCurrentRole(role);
  };

  const handleResetDemo = () => {
    legalAidStore.resetToDefault();
    setSelectedCase(null);
  };

  const handleCaseSelect = (c: CanonicalCase) => {
    setSelectedCase(c);
  };

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
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Persistent Government Sidebar */}
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

        {/* Viewport Content Area */}
        <main className="flex-1 p-3 sm:p-5 overflow-y-auto min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              cases={cases}
              lawyers={lawyers}
              districtMetrics={districtMetrics}
              currentRole={currentUser.role}
              onNavigateToTab={setActiveTab}
              onSelectCase={handleCaseSelect}
            />
          )}

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

          {activeTab === 'attention' && (
            <AttentionTodayQueue
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

      {/* 3. Global Action Modals */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          lawyers={lawyers}
          currentRole={currentUser.role}
          onClose={() => setSelectedCase(null)}
          onRefresh={() => {
            const updated = legalAidStore.getCases().find(c => c.caseId === selectedCase.caseId);
            if (updated) setSelectedCase({ ...updated });
          }}
          onOpenNikahnamaPreview={(c) => setNikahnamaCase(c)}
        />
      )}

      {isNewAppModalOpen && (
        <NewApplicationModal
          onClose={() => setIsNewAppModalOpen(false)}
          onSuccess={(caseId) => {
            setIsNewAppModalOpen(false);
            const created = legalAidStore.getCases().find(c => c.caseId === caseId);
            if (created) setSelectedCase(created);
          }}
        />
      )}

      {nikahnamaCase && (
        <NikahnamaPreviewModal
          caseItem={nikahnamaCase}
          onClose={() => setNikahnamaCase(null)}
        />
      )}
    </div>
  );
};

export default App;
