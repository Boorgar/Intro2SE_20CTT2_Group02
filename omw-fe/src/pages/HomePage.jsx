import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Revenue vs Orders',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Revenue',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgb(203 213 225)',
        },
        {
            label: 'Orders',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgb(100 116 139)',
        },
    ],
};

export const data1 = {
    labels: ['Tim', 'Ryan', 'John', 'Smith', 'Ralph', 'Robert'],
    datasets: [
        {
            label: 'Workload',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

export const options3 = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Leftover Stocks',
        },
    },
};

export const data3 = {
    labels,
    datasets: [
        {
            label: 'Stocks',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgb(203 213 225)',
        },
    ],
};

export const data2 = {
    labels: ['Lights', 'Chairs', 'Tables', 'Empty'],
    datasets: [
        {
            label: 'Workload',
            data: [20, 40, 30, 10],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

export default function HomePage() {
    return (
        <div className="flex flex-col w-full h-full my-10">
            <div className="w-full flex justify-center">
                <div className="w-2/5">
                    <Bar options={options} data={data} />
                </div>
                <div className="w-1/5 text-center">
                    <span>Workload</span>
                    <Pie data={data1} />
                </div>
            </div>
            <div className="w-full flex justify-center my-10">
                <div className="w-2/5">
                    <Bar options={options3} data={data3} />
                </div>
                <div className="w-1/5 text-center">
                    <span>Storage</span>
                    <Pie data={data2} />
                </div>
            </div>
        </div>
    );
}
