import React from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList } from 'recharts';
import Card from '../Card';
import WordCloud from '../WordCloud';
import { inOutflowTrendData, orgTurnoverRateData, earlyTurnoverData, voluntaryTurnoverData, turnoverWordCloudData, recruitmentEfficiencyData, turnoverRiskData, turnoverRiskOrgs, heatmapColors } from '../../data';

const SimpleMetricCard: React.FC<{ title: string; value: string; color?: string }> = ({ title, value, color = 'text-gray-700' }) => (
    <div className="flex items-center justify-between">
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
        <span className="text-lg text-gray-600">{title}</span>
    </div>
);

const InOutflowStatusDashboard = () => {
    return (
        <section className="animate-fadeIn">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">1.2. 입퇴사자 현황 (Inflow/Outflow Status)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Card title="월별 입사자/퇴사자 수 및 퇴직률 추이" tooltipText="<strong>의미:</strong> 월별 인력 유입 및 유출 현황과 퇴직률의 장기적인 추세를 보여줍니다.<br><strong>데이터 공식:</strong> <ul><li>월별 퇴직률 = (월별 퇴사자 수 / 해당 월 평균 재직 인원수) * 100</li></ul>" className="lg:col-span-2">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={inOutflowTrendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" unit="%" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="입사자 수" fill="#8884d8" />
                                <Bar yAxisId="left" dataKey="퇴사자 수" fill="#ffc658" />
                                <Line yAxisId="right" type="monotone" dataKey="퇴직률" stroke="#82ca9d" name="퇴직률 (%)" strokeWidth={2} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="퇴직 예측 위험도 분포" tooltipText="<strong>의미:</strong> 머신러닝 모델을 통해 예측된 퇴직 위험이 높은 인원의 분포를 조직과 직급별로 보여줍니다.<br><strong>데이터 공식:</strong> <ul><li>머신러닝 모델 기반 예측 점수 및 분류</li></ul>">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-center">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-2 px-4 text-sm font-medium text-gray-600">직급 \ 조직</th>
                                    {turnoverRiskOrgs.map(org => (
                                       <th key={org} className="py-2 px-4 text-sm font-medium text-gray-600">{org}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {turnoverRiskData.map(row => (
                                    <tr key={row.level}>
                                        <td className="py-3 px-4 text-left text-gray-700 font-medium border border-gray-200">{row.level}</td>
                                        {turnoverRiskOrgs.map(org => (
                                            <td key={org} className={`py-3 px-4 font-bold text-white border border-gray-200 ${heatmapColors[row[org.toLowerCase() as keyof typeof row] as keyof typeof heatmapColors]}`}>
                                                {row[org.toLowerCase() as keyof typeof row]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
                
                <Card title="조직별 퇴직률 및 퇴직 인원수" tooltipText="<strong>의미:</strong> 각 조직(부서)의 퇴직률을 비교하여 인력 유출이 심한 문제 조직을 식별합니다.<br><strong>데이터 공식:</strong> <ul><li>조직별 퇴직률 = (해당 조직 퇴사자 수 / 해당 조직 평균 재직 인원수) * 100</li></ul>">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={orgTurnoverRateData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 5]} ticks={[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]} tickFormatter={(tick) => `${tick.toFixed(1)}%`} />
                                <Tooltip formatter={(value: number, name: string) => [`${value}${name === '퇴직률' ? '%' : '명'}`, name]} />
                                <Bar dataKey="퇴직률" fill="#FF8042">
                                    <LabelList dataKey="퇴직 인원수" position="top" formatter={(value: number) => `${value}명`} style={{ fill: '#333', fontSize: 12 }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="신규 입사자 조기 퇴직률" tooltipText="<strong>의미:</strong> 신규 입사자 중 일정 기간 내에 퇴사하는 인원의 비율을 보여줍니다. 온보딩 프로세스의 효과성 파악에 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>조기 퇴직률 = (해당 기간 내 신규 입사자 중 퇴사자 수 / 해당 기간 신규 입사자 수) * 100</li></ul>">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={earlyTurnoverData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 40]} ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40]} tickFormatter={(tick) => `${tick}%`} />
                                <Tooltip formatter={(value: number) => `${value}%`} />
                                <Bar dataKey="value" name="조기 퇴직률" fill="#FFBB28" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="자발적/비자발적 퇴직률 추이" tooltipText="<strong>의미:</strong> 퇴직의 성격에 따른 퇴직률 추이를 보여줍니다. 조직 문화, 보상 등 내부 요인에 의한 이탈을 관리하는데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>자발적 퇴직률 = (자발적 퇴사자 수 / 평균 재직 인원수) * 100</li></ul>">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={voluntaryTurnoverData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis unit="%"/>
                                <Tooltip formatter={(value: number) => `${value}%`} />
                                <Legend />
                                <Line type="monotone" dataKey="자발적" stroke="#00C49F" strokeWidth={2} name="자발적 퇴직률 (%)" />
                                <Line type="monotone" dataKey="비자발적" stroke="#FF8042" strokeWidth={2} name="비자발적 퇴직률 (%)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="퇴직 사유 키워드 (워드클라우드)" tooltipText="<strong>의미:</strong> 퇴직 인터뷰 등에서 추출된 핵심 키워드를 시각화하여 퇴직의 근본 원인을 직관적으로 파악합니다. 키워드의 크기는 언급 빈도를 나타냅니다.">
                    <div className="h-72 flex items-center justify-center">
                        <WordCloud data={turnoverWordCloudData} />
                    </div>
                </Card>

                <Card title="채용 소요 시간 및 비용" tooltipText="<strong>의미:</strong> 직무별 채용 프로세스의 효율성을 측정하는 지표입니다. 채용 병목 현상을 식별하고 전략을 최적화하는 데 활용됩니다.<br><strong>데이터 공식:</strong> <ul><li>채용 소요 시간 = (최종 채용일 - 채용 공고 게시일)</li><li>채용 비용 = (총 채용 관련 비용 / 총 채용 인원수)</li></ul>" className="lg:col-span-2">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={recruitmentEfficiencyData} margin={{ right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="right1" orientation="right" stroke="#0088FE" label={{ value: '일', position: 'insideTopRight', offset: -25, dx: 10 }} />
                                <YAxis yAxisId="right2" orientation="right" stroke="#00C49F" label={{ value: '만원', position: 'insideTopRight', offset: -25, dx: 10 }} />
                                <Tooltip formatter={(value: number, name: string) => [name === '채용 소요 시간 (일)' ? `${value}일` : `${value}만원`, name.split('(')[0].trim()]}/>
                                <Legend />
                                <Bar yAxisId="right1" dataKey="소요 시간" fill="#0088FE" name="채용 소요 시간 (일)" />
                                <Bar yAxisId="right2" dataKey="채용 비용" fill="#00C49F" name="채용 비용 (만원)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card title="퇴직 비용 추정 (인당/총액)" tooltipText="<strong>의미:</strong> 퇴직으로 인해 발생하는 비용을 추정하여 보여줍니다. 이직률 관리의 경제적 중요성을 강조합니다.<br><strong>데이터 공식:</strong> <ul><li>인당 퇴직 비용 = (총 직접 비용 + 총 간접 비용) / 총 퇴사자 수</li></ul>">
                    <div className="flex flex-col space-y-4 h-full justify-center">
                        <SimpleMetricCard title="인당 퇴직 비용" value="500만" />
                        <SimpleMetricCard title="총 퇴직 비용 (당월)" value="5천만원" />
                    </div>
                </Card>
                
            </div>
        </section>
    );
};

export default InOutflowStatusDashboard;