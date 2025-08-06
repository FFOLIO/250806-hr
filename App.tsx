
import React, { useState } from 'react';
import HeadcountStatusDashboard from './components/dashboards/HeadcountStatusDashboard';
import InOutflowStatusDashboard from './components/dashboards/InOutflowStatusDashboard';
import CompensationStatusDashboard from './components/dashboards/CompensationStatusDashboard';
import PerformanceStatusDashboard from './components/dashboards/PerformanceStatusDashboard';
import AttendanceStatusDashboard from './components/dashboards/AttendanceStatusDashboard';

type TabId = 'headcount-status' | 'inoutflow-status' | 'compensation-status' | 'performance-status' | 'attendance-status';

const TABS: { id: TabId; label: string }[] = [
    { id: 'headcount-status', label: '인원 현황' },
    { id: 'inoutflow-status', label: '입퇴사자 현황' },
    { id: 'compensation-status', label: '임금 현황' },
    { id: 'performance-status', label: '평가 현황' },
    { id: 'attendance-status', label: '근태 현황' },
];

const Header = () => (
    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center font-sans">
        핵심 HR 대시보드
    </h1>
);

interface NavbarProps {
    activeTab: TabId;
    onTabClick: (tabId: TabId) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabClick }) => (
    <nav className="mb-8 flex flex-wrap justify-center gap-4">
        {TABS.map(tab => (
            <button
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 ${
                    activeTab === tab.id
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
                {tab.label}
            </button>
        ))}
    </nav>
);

const App = () => {
    const [activeTab, setActiveTab] = useState<TabId>('headcount-status');

    const renderDashboard = () => {
        switch (activeTab) {
            case 'headcount-status':
                return <HeadcountStatusDashboard />;
            case 'inoutflow-status':
                return <InOutflowStatusDashboard />;
            case 'compensation-status':
                return <CompensationStatusDashboard />;
            case 'performance-status':
                return <PerformanceStatusDashboard />;
            case 'attendance-status':
                return <AttendanceStatusDashboard />;
            default:
                return <HeadcountStatusDashboard />;
        }
    };

    return (
        <div className="p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <Header />
                <Navbar activeTab={activeTab} onTabClick={setActiveTab} />
                <main>{renderDashboard()}</main>
            </div>
        </div>
    );
};

export default App;
