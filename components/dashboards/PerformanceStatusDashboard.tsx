import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import Card from '../Card';
import RadioGroup from '../RadioGroup';
import type { RadioOption } from '../../types';
import { 
    engagementScoreData, 
    leadershipScoreData, 
    performanceScoreData, 
    performanceGradeData, 
    goalAchievementData,
    leaderCompetencyData,
    avgPerformanceCompensationData,
    seriesColors
} from '../../data';

const categoryFilterOptions: RadioOption[] = [
    { value: 'organization', label: '조직별' },
    { value: 'position', label: '직급별' },
    { value: 'jobFunction', label: '직무별' },
];

const leadershipFilterOptions: RadioOption[] = [
    { value: 'organization', label: '조직별' },
    { value: 'jobFunction', label: '직무별' },
];

const perfCompFilterOptions: RadioOption[] = [
    { value: 'organization', label: '조직별' },
    { value: 'jobFunction', label: '직무별' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8428FF'];

const PerformanceStatusDashboard = () => {
    const [perfScoreFilter, setPerfScoreFilter] = useState('organization');
    const [perfGradeFilter, setPerfGradeFilter] = useState('organization');
    const [goalFilter, setGoalFilter] = useState('organization');
    const [leadershipFilter, setLeadershipFilter] = useState('organization');
    const [leaderCompetencyFilter, setLeaderCompetencyFilter] = useState('organization');
    const [perfCompFilter, setPerfCompFilter] = useState('organization');

    const gradeChartData = performanceGradeData[perfGradeFilter as keyof typeof performanceGradeData];
    const leaderCompetencyChartData = leaderCompetencyData[leaderCompetencyFilter as keyof typeof leaderCompetencyData];
    const avgPerfCompData = avgPerformanceCompensationData[perfCompFilter as keyof typeof avgPerformanceCompensationData];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
                    <p className="font-bold text-gray-700">{data.name}</p>
                    <p className="text-sm text-gray-600">{`성과 점수: ${data.x}점`}</p>
                    <p className="text-sm text-gray-600">{`연봉 인상률: ${data.y}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="animate-fadeIn">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">2.4. 평가 현황 (Performance Status)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Card title="조직별/직급별/직무별 평균 성과 점수 및 분포" tooltipText="<strong>의미:</strong> 각 조직, 직급, 직무별 평균 성과 점수와 분포를 보여줍니다. 전체적인 성과 수준과 고성과/저성과 그룹의 특성을 파악하는 데 활용됩니다." className="lg:col-span-2">
                    <RadioGroup name="orgPerformanceScoreChart" options={categoryFilterOptions} selectedValue={perfScoreFilter} onChange={setPerfScoreFilter} />
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceScoreData[perfScoreFilter as keyof typeof performanceScoreData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis unit="점" />
                                <Tooltip formatter={(value: number) => `${value}점`} />
                                <Bar dataKey="value" name="평균 성과 점수" fill="#00C49F" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="직원 만족도/참여도 지수 (Engagement Score) 및 추이" tooltipText="<strong>의미:</strong> 주기적인 설문조사를 통해 측정된 직원 만족도 및 참여도 지수를 보여줍니다. 성과와 연계된 직원들의 정서적 상태를 파악하고 잠재적인 이직 위험을 감지하는 데 활용됩니다.">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl font-bold text-yellow-500">85점</div>
                        <div className="text-lg text-gray-600">현재 직원 만족도</div>
                    </div>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={engagementScoreData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[75, 95]} unit="점"/>
                                <Tooltip formatter={(value: number) => `${value}점`} />
                                <Line type="monotone" dataKey="value" name="만족도 점수" stroke="#FFBB28" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="성과 등급별 인원 및 비율 추이" tooltipText="<strong>의미:</strong> 평가 등급(예: S, A, B, C)별 인원수 및 비율을 보여줍니다. 평가 제도의 공정성 및 변별력을 검토하는 데 활용됩니다.">
                    <RadioGroup name="performanceGradeChart" options={categoryFilterOptions} selectedValue={perfGradeFilter} onChange={setPerfGradeFilter} />
                    <div className="h-60">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart 
                                data={gradeChartData.data}
                                layout="vertical" 
                                stackOffset="expand"
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" hide domain={[0, 1]} />
                                <YAxis type="category" dataKey="name" width={70} />
                                <Tooltip formatter={(value: number, name) => [`${(value * 100).toFixed(0)}%`, name]} />
                                <Legend />
                                {gradeChartData.keys.map((key, index) => (
                                    <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="목표 달성률 (개인/팀/조직별)" tooltipText="<strong>의미:</strong> 개인, 팀, 조직 단위의 핵심성과지표(KPI) 또는 목표(OKR) 달성률을 보여줍니다. 조직의 전략 목표 달성 여부를 정량적으로 보여줍니다.">
                    <RadioGroup name="goalAchievementChart" options={categoryFilterOptions} selectedValue={goalFilter} onChange={setGoalFilter} />
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={goalAchievementData[goalFilter as keyof typeof goalAchievementData]} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[80, 100]} unit="%"/>
                                <YAxis type="category" dataKey="name" width={70} />
                                <Tooltip formatter={(value: number) => `${value}%`} />
                                <Bar dataKey="value" name="목표 달성률" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="리더십 평가 점수 (Manager Quality Index)" tooltipText="<strong>의미:</strong> 팀원들이 평가한 리더십 역량 점수를 부서별로 비교합니다. 관리자의 역량이 팀 성과 및 직원 유지에 미치는 영향을 분석하는 데 활용됩니다.">
                    <RadioGroup name="leadershipScoreChart" options={leadershipFilterOptions} selectedValue={leadershipFilter} onChange={setLeadershipFilter} />
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={leadershipScoreData[leadershipFilter as keyof typeof leadershipScoreData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[3, 5]} unit="점"/>
                                <Tooltip formatter={(value: number) => `${value.toFixed(1)}점 (5점 만점)`} />
                                <Bar dataKey="value" name="리더십 점수" fill="#0088FE" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="리더 역량 평가 결과" tooltipText="<strong>의미:</strong> 리더들의 핵심 역량(예: 비전 제시, 코칭, 성과 관리)에 대한 평가 결과를 보여줍니다. 리더십 개발 프로그램의 효과성을 측정하고 조직의 리더십 파이프라인을 강화하는 데 활용됩니다." className="lg:col-span-2">
                    <RadioGroup name="leaderCompetencyFilter" options={leadershipFilterOptions} selectedValue={leaderCompetencyFilter} onChange={setLeaderCompetencyFilter} />
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={leaderCompetencyChartData.data}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[70, 100]} />
                                <Tooltip />
                                <Legend />
                                {leaderCompetencyChartData.keys.map((key) => (
                                    <Radar 
                                        key={key}
                                        name={key} 
                                        dataKey={key} 
                                        stroke={seriesColors[leaderCompetencyFilter as keyof typeof seriesColors][key as keyof typeof seriesColors.organization]} 
                                        fill={seriesColors[leaderCompetencyFilter as keyof typeof seriesColors][key as keyof typeof seriesColors.organization]} 
                                        fillOpacity={0.2} 
                                    />
                                ))}
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card title="성과-보상 연계 지표" tooltipText="<strong>의미:</strong> 개인의 성과 점수와 실제 연봉 인상률 또는 성과급 지급액 간의 상관관계를 보여줍니다. 성과가 보상으로 이어지는 정도를 명확히 보여주어 보상 체계의 공정성을 확보합니다." className="lg:col-span-3">
                    <RadioGroup name="performanceCompensationChart" options={perfCompFilterOptions} selectedValue={perfCompFilter} onChange={setPerfCompFilter} />
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="x" name="성과 점수" unit="점" domain={[70, 95]} />
                                <YAxis type="number" dataKey="y" name="연봉 인상률" unit="%" domain={[4, 16]}/>
                                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }}/>
                                <Legend />
                                {avgPerfCompData.map((entry) => (
                                  <Scatter
                                    key={entry.name}
                                    name={entry.name}
                                    data={[entry]}
                                    fill={seriesColors[perfCompFilter as keyof typeof seriesColors][entry.name as keyof typeof seriesColors.organization]}
                                  />
                                ))}
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default PerformanceStatusDashboard;