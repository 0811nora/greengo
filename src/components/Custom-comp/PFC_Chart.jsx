import React from 'react';
import Chart from 'react-apexcharts';

const DonutPFC = ({ protein = 0, fat = 0, carbs = 0, calories = 0 }) => {
    const isNoData = protein === 0 && fat === 0 && carbs === 0;
    const series = isNoData ? [0.0001, 0, 0] : [Number(protein), Number(fat), Number(carbs)];
    const displayCalories = calories || (protein * 4) + (fat * 9) + (carbs * 4);

    const options = {
        labels: ['蛋白質', '脂肪', '碳水'],
        colors: isNoData ? ['#C7CDC2'] : ['#d7d566', '#e7976d', '#94ba7b'],
        
        chart: {
            id: 'nutrient-chart',
            toolbar: { show: false },
        },
        tooltip: {
            enabled: !isNoData,
            shared: false,
            intersect: true
        },
        dataLabels: {
            enabled: true,
            distance: -15, 
            style: { 
                fontSize: '11px', 
                fontWeight: '700', 
                colors: isNoData ? ['transparent'] : ['#eaeaea'] 
            },
            formatter: (val) => isNoData ? "" : val.toFixed(0) + "%"
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '11px',
            itemMargin: { horizontal: 2, vertical: 0 },
            markers: { width: 8, height: 8, radius: 12 },
            labels: {
                colors: undefined 
            }
        },
        plotOptions: {
            pie: {
                customScale: 1, 
                donut: {
                    size: '55%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '12px',
                            color: '#666',
                            offsetY: 20,
                            formatter: () => isNoData ? '-' : '總熱量'
                        },
                        value: {
                            show: true,
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            color: isNoData ? '#ccc' : '#333',
                            offsetY: -15,
                            formatter: () => isNoData ? '0' : Math.round(displayCalories)
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: isNoData ? '-' : '總熱量',
                            fontSize: '12px',
                            color: '#666',
                            formatter: () => isNoData ? '0' : Math.round(displayCalories)
                        }
                    }
                }
            }
        },
        grid: {
            padding: { left: 0, right: 0, top: 0, bottom: 0 }
        },
        stroke: { 
            show: true,
            width: 1, 
            colors: ['#fff']
        }
    };

    return (
        <div style={{ 
            width: '100%', 
            maxWidth: '250px', 
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Chart 
                options={options} 
                series={series} 
                type="donut" 
                width="80%" 
            />
        </div>
    );
};

export default DonutPFC;