/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Chart as ChartJS } from 'chart.js/auto';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '@/app/config';

export default function Dashboard() {
    const [incomePerDays, setIncomePerDays] = useState<any[]>([]);
    const [incomePerMonths, setIncomePerMonths] = useState<any[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [monthName, setMonthName] = useState<string[]>([
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]);
    const [days, setDays] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
    const [month, setMonth] = useState<number>(dayjs().month() + 1);
    const [chartPerDay, setChartPerDay] = useState<ChartJS | null>(null);
    const [chartPerMonth, setChartPerMonth] = useState<ChartJS | null>(null);

    useEffect(() => {
        const totalDayInMonth = dayjs().daysInMonth();
        setDays(Array.from({ length: totalDayInMonth }, (_, index) => index + 1));
        setYears(Array.from({ length: 5 }, (_, index) => dayjs().year() - index));
        fetchData();
    }, []);

    useEffect(() => {
        // Render daily chart only when incomePerDays changes
        if (incomePerDays.length > 0) {
            createBarChartDays(incomePerDays);
        }
    }, [incomePerDays]);

    useEffect(() => {
        // Render monthly chart only when incomePerMonths changes
        if (incomePerMonths.length > 0) {
            createBarChartMonths(incomePerMonths);
        }
    }, [incomePerMonths]);

    const fetchData = () => {
        fetchDataSumPerDayInYearAndMonth();
        fetchDataSumPerMonthInYear();
    };

    const createBarChartDays = (incomePerDays: any[]) => {
        const labels = incomePerDays.map((_, i) => i + 1);
        const data = incomePerDays.map(item => item.amount);

        // Ensure destruction and resetting to null before creating a new chart
        if (chartPerDay) {
            chartPerDay.destroy();
            setChartPerDay(null);
        }

        const ctx = document.getElementById('chartPerDay') as HTMLCanvasElement | null;
        if (!ctx) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Chart canvas for days not found.' });
            return;
        }

        const chart = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'รายรับรวมตามวัน (บาท)',
                    data: data,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        setChartPerDay(chart);
    };

    const fetchDataSumPerDayInYearAndMonth = async () => {
        try {
            const token = localStorage.getItem(config.token);
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const res = await axios.post(`${config.apiServer}/api/report/sumPerDayInYearAndMonth`, { year: selectedYear, month }, { headers });
            setIncomePerDays(res.data.results);
        } catch (e: any) {
            Swal.fire({ icon: 'error', title: 'Error', text: e.message });
        }
    };

    const createBarChartMonths = (incomePerMonths: any[]) => {
        const data = incomePerMonths.map(item => item.amount);

        if (chartPerMonth) {
            chartPerMonth.destroy();
            setChartPerMonth(null);
        }

        const ctx = document.getElementById('chartPerMonth') as HTMLCanvasElement | null;
        if (!ctx) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Chart canvas for months not found.' });
            return;
        }

        const chart = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: monthName,
                datasets: [{
                    label: 'รายรับรวมตามเดือน (บาท)',
                    data: data,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        setChartPerMonth(chart);
    };

    const fetchDataSumPerMonthInYear = async () => {
        try {
            const token = localStorage.getItem(config.token);
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const res = await axios.post(`${config.apiServer}/api/report/sumPerMonthInYear`, { year: selectedYear }, { headers });
            setIncomePerMonths(res.data.results);
        } catch (e: any) {
            Swal.fire({ icon: 'error', title: 'Error', text: e.message });
        }
    };

    return (
        <div className='card mt-3'>
            <div className='card-header'>Dashboard</div>
            <div className='card-body'>
                <div className='row'>
                    <div className='col-md-3'>
                        <div className='form-group'>
                            <div>ปี</div>
                            <select className='form-control' value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                                {years.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='form-group'>
                            <div>เดือน</div>
                            <select className='form-control' value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                                {monthName.map((item, index) => (
                                    <option key={index} value={index + 1}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <button className='btn btn-primary' onClick={fetchData}>
                            <i className='fa fa-search me-2' />
                            แสดงข้อมูล
                        </button>
                    </div>
                    <div className='col-md-6'>
                        <div className='h4'>สรุปยอดขายรายวัน</div>
                        <canvas id='chartPerDay' height="200" />
                    </div>
                    <div className='col-md-6'>
                        <div className='h4'>สรุปยอดขายรายเดือน</div>
                        <canvas id='chartPerMonth' height="200" />
                    </div>
                </div>
            </div>
        </div>
    );
}