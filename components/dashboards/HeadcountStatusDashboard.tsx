import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend, CartesianGrid } from 'recharts';
import Card from '../Card';
import { headcountTrendData, orgHeadcountData, positionHeadcountData, genderDiversityData, employmentTypeDiversityData, ageDistributionData, expatTrendData, corePositionsData } from '../../data';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const SimpleMetricCard: React.FC<{ title: string; value: string; color: string; change?: string }> = ({ title, value, color, change }) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-lg text-gray-600">{title}</div>
        </div>
        {change && <div className={`text-3xl font-bold ${color}`}>{change}</div>}
    </div>
);

const HeadcountStatusDashboard = () => {
    const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
        if (percent < 0.05) return null; // Hide label for small slices
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="#333333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-sm">
                {`${value}명 (${(percent * 100).toFixed(0)}%)`}
            </text>
        );
    };

    return (
        <section className="animate-fadeIn">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">1.1. 인원 현황 (Headcount Status)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <Card title="총 재직 인원 및 월별 변동 추이" tooltipText="<strong>의미:</strong> 조직의 전체 인력 규모와 월별 인력 증감 추이를 보여줍니다. 기업의 성장 또는 축소 단계를 파악하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>순 인원 변동 = (월별 입사자 + 복직자) - (월별 퇴사자 + 휴직자)</li></ul>" className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl font-bold text-blue-600">1,000명</div>
                        <div className="text-lg text-gray-600">현재 총 재직 인원</div>
                    </div>
                    <div className="h-72 mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={headcountTrendData.organization.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="입사자" stroke="#00C49F" strokeWidth={2} />
                                <Line type="monotone" dataKey="퇴사자" stroke="#FF8042" strokeWidth={2} />
                                <Line type="monotone" dataKey="순 증감" stroke="#0088FE" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="인당 매출액/영업이익" tooltipText="<strong>의미:</strong> 인력 투입 대비 사업 성과를 간접적으로 보여주는 생산성 지표입니다. HR의 비즈니스 기여도를 측정하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>인당 매출액 = 총 매출액 / 총 재직 인원수</li><li>인당 영업이익 = 총 영업이익 / 총 재직 인원수</li></ul>">
                    <div className="flex flex-col space-y-6 h-full justify-center">
                         <SimpleMetricCard title="인당 매출액" value="11억" color="text-indigo-600" />
                         <SimpleMetricCard title="인당 영업이익" value="900만" color="text-indigo-600" />
                    </div>
                </Card>

                <Card title="조직별 재직 인원수 및 비율" tooltipText="<strong>의미:</strong> 각 조직(부서)의 현재 인원수와 전체 인원 대비 비율을 보여줍니다. 조직 간 인력 불균형을 진단하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>조직별 비율 = (해당 조직 인원수 / 총 재직 인원수) * 100</li></ul>">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={orgHeadcountData} layout="vertical" margin={{ right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={60} />
                                <Tooltip formatter={(value: number) => `${value}명`} />
                                <Bar dataKey="value" name="인원수" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="직급별 재직 인원 비율" tooltipText="<strong>의미:</strong> 전체 인원 중 각 직급이 차지하는 비율을 보여줍니다. 직급별 인력 구성의 균형을 파악하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>직급별 비율 = (해당 직급 인원수 / 총 재직 인원수) * 100</li></ul>">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={positionHeadcountData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} fill="#8884d8" labelLine={false} label={renderPieLabel}>
                                    {positionHeadcountData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number, name: string) => [`${value}명`, name]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card title="다양성 지표 (성별 비율)" tooltipText="<strong>의미:</strong> 조직의 인구 통계학적 요소별 인력 분포를 보여줍니다. DEI(다양성, 형평성, 포용성) 전략 수립에 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>각 요소별 비율 = (해당 요소 인원수 / 총 재직 인원수) * 100</li></ul>">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={genderDiversityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} fill="#8884d8" labelLine={false} label={renderPieLabel}>
                                    {genderDiversityData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#0088FE', '#FF8042'][index % 2]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number, name: string) => [`${value}명`, name]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="다양성 지표 (고용형태별 비율)" tooltipText="<strong>의미:</strong> 조직의 인구 통계학적 요소별 인력 분포를 보여줍니다. DEI(다양성, 형평성, 포용성) 전략 수립에 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>각 요소별 비율 = (해당 요소 인원수 / 총 재직 인원수) * 100</li></ul>">
                     <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={employmentTypeDiversityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} fill="#8884d8" labelLine={false} label={renderPieLabel}>
                                    {employmentTypeDiversityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number, name: string) => [`${value}명`, name]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card title="평균 근속년수 및 연령대별 분포" tooltipText="<strong>의미:</strong> 직원들의 평균 근속년수와 연령대별 인력 분포를 보여줍니다. 조직 안정성 및 인력 구조를 판단하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>평균 근속년수 = 모든 직원의 근속년수 합계 / 총 재직 인원수</li></ul>" className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl font-bold text-green-600">5.8년</div>
                        <div className="text-lg text-gray-600">평균 근속년수</div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageDistributionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `${value}명`} />
                                <Bar dataKey="value" name="인원수" fill="#00C49F" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card title="핵심 직무별 인원 현황 및 공석률" tooltipText="<strong>의미:</strong> 기업의 핵심 직무나 직급의 현재 인원과 채용이 필요한 공석 수를 보여줍니다. 사업 연속성 확보를 위한 인력 현황 관리에 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>공석률 = (공석 수 / (현재 인원 + 공석 수)) * 100</li></ul>" className="lg:col-span-3">
                    <table className="min-w-full bg-white rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">핵심 직무</th>
                                <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">현재 인원</th>
                                <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">공석</th>
                                <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">공석률(%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {corePositionsData.map(pos => (
                                <tr key={pos.name} className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-700 font-medium">{pos.name}</td>
                                    <td className="py-3 px-4 text-gray-700 text-center">{pos.current}</td>
                                    <td className="py-3 px-4 text-gray-700 text-center">{pos.vacancy}</td>
                                    <td className="py-3 px-4 text-gray-700 text-center">{pos.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Card title="주재원 현황 및 변동 추이" tooltipText="<strong>의미:</strong> 글로벌 사업을 영위하는 기업의 해외 배치 인력 현황과 변동 추이를 보여줍니다. 글로벌 인력 운영 전략 및 리스크 관리에 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>변동 추이 = 월별 주재원 인원수</li></ul>" className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl font-bold text-orange-600">45명</div>
                        <div className="text-lg text-gray-600">현재 주재원</div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={expatTrendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                                <Tooltip formatter={(value: number) => `${value}명`}/>
                                <Line type="monotone" dataKey="value" name="주재원 수" stroke="#FF8042" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default HeadcountStatusDashboard;