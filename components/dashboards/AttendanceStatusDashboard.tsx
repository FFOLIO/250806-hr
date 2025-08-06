import React from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import Card from '../Card';
import { workHoursData, absenteeismTardinessData, leaveOfAbsenceData, flexibleWorkData, remoteWorkData, remainingLeaveData, attendanceAlerts } from '../../data';

const COLORS = ['#00C49F', '#FFBB28', '#8884d8', '#FF8042'];
const PIE_COLORS = {
    flex: ['#0891b2', '#e5e7eb'],
    remote: ['#9333ea', '#e5e7eb']
};


const RadialProgress: React.FC<{ progress: number }> = ({ progress }) => {
    const size = 128;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="text-gray-200"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-green-500"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-green-700">{progress}</span>
            </div>
        </div>
    );
};

const AttendanceStatusDashboard = () => {
    const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
        if (percent < 0.05) return null; // Hide label for small slices
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="#333333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-sm">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const DoughnutLabel = ({ cx, cy, data }) => {
        const percent = data[0].value;
        return (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-700">
                {`${percent}%`}
            </text>
        );
    };

    const alertSeverityClasses: { [key: string]: string } = {
        high: 'bg-red-100 border-l-4 border-red-500 text-red-800',
        medium: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800',
        low: 'bg-blue-100 border-l-4 border-blue-500 text-blue-800',
    };


    return (
        <section className="animate-fadeIn">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">2.5. 근태 현황 (Attendance Status)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Card title="조직별 월별 총 근무 시간 및 연장 근무 시간" tooltipText="<strong>의미:</strong> 각 조직, 직급, 개인별 총 근무 시간과 연장 근무 시간을 보여줍니다. 실제 근무 시간 패턴을 파악하고 과도한 연장 근무를 관리하여 직원의 번아웃을 방지하는 데 활용됩니다." className="lg:col-span-2">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workHoursData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `${value}시간`} />
                                <Legend />
                                <Bar dataKey="월평균 근무 시간" stackId="a" fill="#0088FE" />
                                <Bar dataKey="월평균 연장 근무" stackId="a" fill="#FF8042" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="근태 이상 징후 알림" tooltipText="<strong>의미:</strong> 시스템에서 설정된 기준을 초과하는 근태 이상 징후 발생 시 HR 담당자 및 해당 관리자에게 자동 알림을 제공합니다.">
                    <div className="space-y-3 h-full overflow-y-auto pr-2">
                        {attendanceAlerts.map((alert, index) => (
                            <div key={index} className={`p-3 rounded-r-md shadow-sm ${alertSeverityClasses[alert.severity]}`}>
                                <p className="font-bold">
                                    {`[${alert.category}] ${alert.target}`}
                                </p>
                                <p className="text-sm">{alert.message}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="결근율 및 지각률" tooltipText="<strong>의미:</strong> 월별/분기별 결근율과 지각률을 추적하고, 조직별/개인별 현황을 비교합니다. 근태 문제 발생 여부 및 추이를 파악합니다.">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={absenteeismTardinessData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `${value}%`} />
                                <Legend />
                                <Line type="monotone" dataKey="결근율" stroke="#FF8042" strokeWidth={2} />
                                <Line type="monotone" dataKey="지각률" stroke="#0088FE" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="휴직 사용률 (유형별)" tooltipText="<strong>의미:</strong> 휴직 유형(육아, 질병 등)별 사용률을 보여줍니다. 직원의 장기적인 안정성과 복지 수준을 파악하고, 인력 운영 계획 수립에 활용됩니다.">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={leaveOfAbsenceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} fill="#8884d8" labelLine={false} label={renderPieLabel}>
                                    {leaveOfAbsenceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="유연근무 사용 현황 및 비율" tooltipText="<strong>의미:</strong> 유연근무제의 사용 현황과 전체 인원 대비 사용 비율을 보여줍니다. 유연한 근무 제도의 활용 정도를 파악하고 정책의 효과성을 분석합니다.">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl font-bold text-cyan-600">320명</div>
                        <div className="text-lg text-gray-600">유연근무 사용 직원</div>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={flexibleWorkData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5}>
                                    {flexibleWorkData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS.flex[index % PIE_COLORS.flex.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value}%`} />
                                <Legend />
                                <DoughnutLabel cx="50%" cy="50%" data={flexibleWorkData}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="재택근무 사용 현황 및 비율" tooltipText="<strong>의미:</strong> 재택근무제의 사용 현황과 전체 인원 대비 사용 비율을 보여줍니다. 유연한 근무 제도의 활용 정도를 파악하고 정책의 효과성을 분석합니다.">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl font-bold text-purple-600">180명</div>
                        <div className="text-lg text-gray-600">재택근무 사용 직원</div>
                    </div>
                     <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={remoteWorkData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5}>
                                     {remoteWorkData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS.remote[index % PIE_COLORS.remote.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value}%`} />
                                <Legend />
                                <DoughnutLabel cx="50%" cy="50%" data={remoteWorkData}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card title="조직별 휴가 잔여일수 및 소진율" tooltipText="<strong>의미:</strong> 각 조직의 평균 휴가 잔여일수와 휴가 소진율을 보여줍니다. 연차 사용 촉진 제도의 운영 효과를 확인합니다.">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl font-bold text-gray-700">75%</div>
                        <div className="text-lg text-gray-600">전체 휴가 소진율</div>
                    </div>
                    <div className="h-48">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={remainingLeaveData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `${value}일`} />
                                <Bar dataKey="value" name="평균 휴가 잔여일수" fill="#FFBB28" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="종합 근태 건강 점수" tooltipText="<strong>의미:</strong> 결근 일수, 연장 근무 시간, 휴가 사용률 등 여러 근태 지표를 종합하여 직원의 전반적인 근태 건강 상태를 보여주는 통합 지수입니다.">
                     <div className="flex flex-col items-center justify-center h-full">
                        <RadialProgress progress={88} />
                        <p className="text-center text-gray-600 mt-2">종합 근태 건강 점수 (100점 만점)</p>
                    </div>
                </Card>

            </div>
        </section>
    );
};

export default AttendanceStatusDashboard;