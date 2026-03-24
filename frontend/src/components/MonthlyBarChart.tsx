import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyBarChartProps {
  chartData: any[];
}

const getResponsiveOptions = (isMobile: boolean) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, 
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: isMobile ? 8 : 12,
      bodySpacing: 4,
      bodyFont: {
        size: isMobile ? 11 : 13,
      },
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) { label += ': '; }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR',
                maximumFractionDigits: 0 
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false, 
      },
      ticks: {
        font: {
            family: "'Inter', sans-serif",
            weight: 'bold' as const,
            size: isMobile ? 10 : 12,
        },
        color: '#64748b',
        maxRotation: isMobile ? 45 : 0,
        minRotation: isMobile ? 45 : 0,
      }
    },
    y: {
      beginAtZero: true,
      border: {
        display: false, 
      },
      grid: {
        color: '#f1f5f9', 
      },
      ticks: {
        font: {
            family: "'Inter', sans-serif",
            size: isMobile ? 10 : 12,
        },
        color: '#94a3b8',
        callback: function(value: any) {
          if (isMobile && value > 999999) {
            return (value / 1000000).toFixed(0) + 'M';
          }
          return new Intl.NumberFormat('id-ID', { 
              minimumFractionDigits: 0 
          }).format(value);
        }
      }
    }
  }
});

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ chartData }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const labels = chartData.map(d => d.label || d.month); 

  const data = {
    labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: chartData.map(d => d.pemasukan),
        backgroundColor: '#28a745', 
        hoverBackgroundColor: '#218838',
        borderRadius: 8,
        borderSkipped: false as const,
        barPercentage: 0.7,
        categoryPercentage: 0.6,
      },
      {
        label: 'Pengeluaran',
        data: chartData.map(d => d.pengeluaran),
        backgroundColor: '#ff4d4d',
        hoverBackgroundColor: '#e60000',
        borderRadius: 8,
        borderSkipped: false as const,
        barPercentage: 0.7,
        categoryPercentage: 0.6,
      },
    ],
  };

  const chartHeight = isMobile ? '250px' : '300px';

  return (
    <div style={{ height: chartHeight, width: '100%', position: 'relative' }}>
      <Bar options={getResponsiveOptions(isMobile)} data={data} /> 
    </div>
  );
};

export default MonthlyBarChart;