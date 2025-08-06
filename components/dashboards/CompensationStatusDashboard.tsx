import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from 'recharts';
import Card from '../Card';
import RadioGroup from '../RadioGroup';
import type { RadioOption } from '../../types';
import { bonusPaymentData, welfareCostData, avgSalaryData, fixedVariablePayData, salaryByAgeAndTenureData, marketBenchmarkDataByJobFunction } from '../../data';

const categoryFilterOptions: RadioOption[] = [
    { value: 'organization', label: '조직별' },
    { value: 'jobFunction', label: '직무별' },
    { value: 'position', label: '직급별' },
];

const ageTenureFilterOptions: RadioOption[] = [
    { value: 'age', label: '연령별' },
    { value: 'tenure', label: '근속년수별' },
];

const jobFunctionFilterOptions: RadioOption[] = [
    { value: '개발', label: '개발' },
    { value: '마케팅', label: '마케팅' },
    { value: '인사', label: '인사' },
    { value: '재무', label: '재무' },
    { value: '디자인', label: '디자인' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8428FF', '#FF6565'];

const SimpleMetricCard: React.FC<{ title: string; value: string; color?: string }> = ({ title, value, color = 'text-gray-700' }) => (
    <div className="flex items-center justify-between">
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
        <span className="text-lg text-gray-600">{title}</span>
    </div>
);

const CompensationStatusDashboard = () => {
    const [avgSalaryFilter, setAvgSalaryFilter] = useState('organization');
    const [fixedVariableFilter, setFixedVariableFilter] = useState('organization');
    const [salaryDemographicFilter, setSalaryDemographicFilter] = useState('organization');
    const [ageTenureFilter, setAgeTenureFilter] = useState('age');
    const [marketBenchmarkJobFilter, setMarketBenchmarkJobFilter] = useState('개발');


    const salaryChartData = salaryByAgeAndTenureData[ageTenureFilter as keyof typeof salaryByAgeAndTenureData][salaryDemographicFilter as keyof typeof salaryByAgeAndTenureData.age];

    return (
        <section className="animate-fadeIn">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">1.3. 임금 현황 (Compensation Status)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Card title="조직별/직급별/직무별 평균 연봉 및 인상률" tooltipText="<strong>의미:</strong> 각 조직, 직급, 직무별 평균 연봉과 인상률을 보여줍니다. 내부 형평성과 외부 시장 경쟁력을 파악하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>인상률 = ((당해 평균 연봉 - 전년 평균 연봉) / 전년 평균 연봉) * 100</li></ul>" className="lg:col-span-2">
                    <RadioGroup name="avgSalaryChart" options={categoryFilterOptions} selectedValue={avgSalaryFilter} onChange={setAvgSalaryFilter} />
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={avgSalaryData[avgSalaryFilter as keyof typeof avgSalaryData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" unit="만원" />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" unit="%" />
                                <Tooltip formatter={(value: number, name: string) => [name === '평균 연봉' ? `${value.toLocaleString()}만원` : `${value}%`, name]}/>
                                <Legend />
                                <Bar yAxisId="left" dataKey="평균 연봉" fill="#8884d8" />
                                <Bar yAxisId="right" dataKey="인상률" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="인당 인건비 및 매출액 대비 비율" tooltipText="<strong>의미:</strong> 총 인건비 효율성과 재무적 건전성을 평가하는 지표입니다.<br><strong>데이터 공식:</strong> <ul><li>매출액 대비 인건비 비율 = (총 인건비 / 총 매출액) * 100</li></ul>">
                    <div className="flex flex-col space-y-4 h-full justify-center">
                        <SimpleMetricCard title="인당 월평균 인건비" value="450만" />
                        <SimpleMetricCard title="매출액 대비 인건비 비율" value="25%" />
                    </div>
                </Card>

                <Card title="고정급 vs 변동급 비율" tooltipText="<strong>의미:</strong> 전체 연봉에서 고정급과 변동급이 차지하는 비율을 보여줍니다. 성과주의 보상 체계의 실제 운영 현황을 분석하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>고정급 비율 = (총 고정급 / 총 연봉) * 100</li></ul>">
                    <RadioGroup name="fixedVariablePayChart" options={categoryFilterOptions} selectedValue={fixedVariableFilter} onChange={setFixedVariableFilter} />
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fixedVariablePayData[fixedVariableFilter as keyof typeof fixedVariablePayData]} layout="vertical" stackOffset="expand">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" hide domain={[0,1]}/>
                                <YAxis type="category" dataKey="name" width={80} />
                                <Tooltip formatter={(value: number) => `${(value * 100).toFixed(0)}%`} />
                                <Legend />
                                <Bar dataKey="고정급" stackId="a" fill="#0088FE" name="고정급" />
                                <Bar dataKey="변동급" stackId="a" fill="#00C49F" name="변동급" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card title="성과급 지급 현황" tooltipText="<strong>의미:</strong> 성과급 대상 인원수, 지급률 및 총 지급액을 보여줍니다. 성과 보상의 동기 부여 효과와 공정성을 검토하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>지급률 = (성과급 지급 대상 인원수 / 총 대상 인원수) * 100</li></ul>">
                     <div className="flex items-center justify-between mb-4">
                        <div className="text-5xl font-bold text-teal-600">3.5억</div>
                        <div className="text-lg text-gray-600">당월 성과급 총 지급액</div>
                    </div>
                    <div className="h-60">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bonusPaymentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis unit="만원"/>
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()}만원`} />
                                <Bar dataKey="value" name="성과급 지급액(만원)" fill="#FFBB28" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="구간별 평균 연봉" tooltipText="<strong>의미:</strong> 연령대별 또는 근속년수 구간별 평균 연봉을 보여줍니다. 연공서열 및 직무 가치에 따른 보상 구조의 적절성을 분석하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>평균 연봉 = 해당 구간 총 연봉 / 해당 구간 인원수</li></ul>" className="lg:col-span-2">
                    <div className="flex justify-between items-start">
                      <RadioGroup name="ageTenureFilter" options={ageTenureFilterOptions} selectedValue={ageTenureFilter} onChange={setAgeTenureFilter} />
                      <RadioGroup name="salaryDemographicFilter" options={categoryFilterOptions} selectedValue={salaryDemographicFilter} onChange={setSalaryDemographicFilter} />
                    </div>
                    <div className="h-72 mt-[-1rem]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salaryChartData.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis unit="만원"/>
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()}만원`} />
                                <Legend />
                                {salaryChartData.keys.map((key, index) => (
                                    <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="복리후생 비용" tooltipText="<strong>의미:</strong> 복리후생 항목별 지출 비용과 직원 만족도 및 유지율에 미치는 영향을 분석합니다.">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={welfareCostData} layout="vertical" margin={{ left: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" unit="만원"/>
                                <YAxis type="category" dataKey="name" width={80} />
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()}만원`} />
                                <Bar dataKey="value" name="지출 비용(만원)" fill="#FF8042" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="시장 임금 벤치마킹" tooltipText="<strong>의미:</strong> 외부 시장의 임금 데이터를 주기적으로 업데이트하여 자사의 임금 수준을 비교합니다.<br><strong>데이터 공식:</strong> <ul><li>자사 평균 연봉 vs. 시장 평균 연봉 비교</li></ul>" className="lg:col-span-3">
                    <RadioGroup name="marketBenchmarkJobFilter" options={jobFunctionFilterOptions} selectedValue={marketBenchmarkJobFilter} onChange={setMarketBenchmarkJobFilter} />
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={marketBenchmarkDataByJobFunction[marketBenchmarkJobFilter as keyof typeof marketBenchmarkDataByJobFunction]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="연차" />
                                <YAxis unit="만원" />
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()}만원`} />
                                <Legend />
                                <Line type="monotone" dataKey="자사" stroke="#0088FE" strokeWidth={2} name="자사 평균 연봉(만원)" />
                                <Line type="monotone" dataKey="시장" stroke="#00C49F" strokeWidth={2} name="시장 평균 연봉(만원)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

            </div>
        </section>
    );
};

export default CompensationStatusDashboard;