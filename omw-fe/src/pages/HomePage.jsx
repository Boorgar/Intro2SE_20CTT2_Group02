import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { Statistic } from 'antd';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function getRandomColor(a) {
  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  const z = Math.floor(Math.random() * 256);
  return 'rgb(' + x + ',' + y + ',' + z + ',' + a + ')';
}

export default function HomePage() {
  const [ordersVsRevenue, setOrdersVsRevenue] = useState({
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [],
  });
  const [workload, setWorkload] = useState({
    labels: [],
    datasets: [
      {
        label: 'Undelivered Workload',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
  const [expectedOrders, setExpectedOrders] = useState({
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [],
  });
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get('http://localhost:3001/orders');
        const workersResponse = await axios.get(
          'http://localhost:3001/workers'
        );
        const productsResponse = await axios.get(
          'http://localhost:3001/products'
        );
        const storageResponse = await axios.get(
          'http://localhost:3001/storage'
        );
        const customersResponse = await axios.get(
          'http://localhost:3001/customers'
        );

        const workersData = workersResponse.data;
        const ordersData = ordersResponse.data;
        const productsData = productsResponse.data;
        const storageData = storageResponse.data;
        const customersData = customersResponse.data;

        const deliveredOrders = ordersData.filter(
          ({ status }) => status === 'Delivered'
        );
        const ordersVsRevenueByMonth = Array.from(Array(12).keys()).map(
          (month) => {
            const currentMonthOrders = deliveredOrders.filter((order) => {
              const currentYear = new Date().getFullYear() - 1;
              const orderDate = new Date(order.createdAt);
              return (
                currentYear === orderDate.getFullYear() &&
                orderDate.getMonth() === month + 1
              );
            });

            const currentMonthRevenue = currentMonthOrders.reduce(
              (accumulate, order) => {
                const productIds = order.products.map((product) => product._id);
                const products = productIds.map((id) =>
                  productsData.find(({ _id }) => _id === id)
                );
                return (
                  accumulate +
                  products.reduce(
                    (acc, { price }, index) =>
                      acc + price * order.products[index].quantity,
                    0
                  )
                );
              },
              0
            );

            return {
              orders: currentMonthOrders.length,
              revenue: currentMonthRevenue.toFixed(2),
            };
          }
        );

        setOrdersVsRevenue({
          ...ordersVsRevenue,
          datasets: [
            {
              label: 'Revenue',
              data: ordersVsRevenueByMonth.map(({ revenue }) => revenue),
              backgroundColor: 'rgb(203 213 225)',
            },
            {
              label: 'Orders',
              data: ordersVsRevenueByMonth.map(({ orders }) => orders),
              backgroundColor: 'rgb(100 116 139)',
            },
          ],
        });

        const undeliveredOrders = ordersData.filter(
          ({ status }) => status !== 'Delivered' && status !== 'Cancelled'
        );
        const workerIds = undeliveredOrders.map(({ workerId }) => workerId);
        const workerResults = [];
        workerIds.forEach((workerId) => {
          if (workerResults.some((val) => val._id === workerId)) {
            workerResults.forEach((val) => {
              if (val._id === workerId) ++val['count'];
            });
          } else {
            workerResults.push({ _id: workerId, count: 1 });
          }
        });

        setWorkload({
          labels: workerIds.map(
            (id) => workersData.find(({ _id }) => _id === id).fullName
          ),
          datasets: [
            {
              label: 'Undelivered Workload',
              data: workerResults.map(({ count }) => count),
              backgroundColor: workerIds.map((_) => getRandomColor(0.5)),
              borderColor: workerIds.map((_) => getRandomColor(0.1)),
              borderWidth: 1,
            },
          ],
        });

        const currentMonth = new Date().getMonth();
        const expectedOrdersWithStatuses = Array.from(
          Array(12 - currentMonth).keys()
        ).map((month) => {
          const currentMonthOrders = undeliveredOrders.filter((order) => {
            const currentYear = new Date().getFullYear() - 1;
            const orderDate = new Date(order.createdAt);
            if (
              currentYear === orderDate.getFullYear() &&
              orderDate.getMonth() === currentMonth
            )
              return orderDate.getDay() >= new Date().getDay();
            return (
              currentYear === orderDate.getFullYear() &&
              orderDate.getMonth() === month + 1
            );
          });

          const orderResults = [];
          currentMonthOrders.forEach((order) => {
            if (orderResults.some((val) => val.status === order.status)) {
              orderResults.forEach((val) => {
                if (val.status === order.status) ++val['count'];
              });
            } else {
              orderResults.push({ status: order.status, count: 1 });
            }
          });

          return orderResults;
        });

        setExpectedOrders({
          ...expectedOrders,
          datasets: [
            {
              label: 'New',
              data: expectedOrdersWithStatuses.map((currentMonth) => {
                const status = currentMonth.filter(
                  ({ status }) => status === 'New'
                )[0];
                return status ? status.count : 0;
              }),
              backgroundColor: 'rgb(100 116 139)',
            },
            {
              label: 'Processing',
              data: expectedOrdersWithStatuses.map((currentMonth) => {
                const status = currentMonth.filter(
                  ({ status }) => status === 'Processing'
                )[0];
                return status ? status.count : 0;
              }),
              backgroundColor: 'rgb(148 163 184)',
            },
            {
              label: 'Sent',
              data: expectedOrdersWithStatuses.map((currentMonth) => {
                const status = currentMonth.filter(
                  ({ status }) => status === 'Sent'
                )[0];
                return status ? status.count : 0;
              }),
              backgroundColor: 'rgb(203 213 225)',
            },
          ],
        });

        setStatistics({
          storage: storageData.length,
          products: productsData.length,
          orders: ordersData.length,
          workers: workersData.length,
          customers: customersData.length,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex justify-between">
        <Statistic
          className="m-10"
          title="Total Sections"
          value={statistics.storage}
        />
        <Statistic
          className="m-10"
          title="Total Products"
          value={statistics.products}
        />
        <Statistic
          className="m-10"
          title="Total Orders"
          value={statistics.orders}
        />
        <Statistic
          className="m-10"
          title="Total Workers"
          value={statistics.workers}
        />
        <Statistic
          className="m-10"
          title="Total Customers"
          value={statistics.customers}
        />
      </div>
      <div className="flex justify-between ">
        <div className="w-1/2 text-center">
          <span>Orders vs Revenue</span>
          <Bar data={ordersVsRevenue} />
        </div>
        <div className="w-1/2 text-center">
          <span>Expected Orders</span>
          <Bar
            options={{
              responsive: true,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                },
              },
            }}
            data={expectedOrders}
          />
        </div>
        {/* <div className="w-1/2 h-1/2 text-center overflow-auto">
        <span>Workload</span>
        <Pie
          data={workload}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
            },
          }}
        />
      </div> */}
      </div>
    </div>
  );
}
