import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import './Chart.scss';
import { useHuntSessions } from 'contexts/HuntSessionsContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'All-time hunts (local)',
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

const Chart = () => {
  const { hunts } = useHuntSessions();
  const dataSet = {
    labels: hunts.map((hunt) => hunt.session?.session.start),
    datasets: [
      {
        label: 'XP Gain',
        data: hunts.map((hunt) => hunt.session?.xpGain),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Loot',
        data: hunts.map((hunt) => hunt.session?.loot),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
      {
        label: 'Damage',
        data: hunts.map((hunt) => hunt.session?.damage),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: true,
      },
    ],
  };
  return (
    <div className="chart">
      <Line datasetIdKey="id" options={options} data={dataSet} />
    </div>
  );
};

export default Chart;
