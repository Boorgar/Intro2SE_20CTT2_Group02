import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Statistic, Tag } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(orders.length);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get('http://localhost:3001/orders');
        const customersResponse = await axios.get(
          'http://localhost:3001/customers'
        );
        const workersResponse = await axios.get(
          'http://localhost:3001/workers'
        );
        const storageResponse = await axios.get(
          'http://localhost:3001/storage'
        );
        const suppliersResponse = await axios.get(
          'http://localhost:3001/suppliers'
        );
        const productsResponse = await axios.get(
          'http://localhost:3001/products'
        );

        const customersData = customersResponse.data;
        const workersData = workersResponse.data;
        const ordersData = ordersResponse.data;
        const storageData = storageResponse.data;
        const suppliersData = suppliersResponse.data;
        const productsData = productsResponse.data;

        const newOrders = ordersData.map((order) => {
          const worker = workersData.find(
            (worker) => worker._id === order.workerId
          );
          const customer = customersData.find(
            (customer) => customer._id === order.customerId
          );
          const supplier = suppliersData.find(
            (supplier) => supplier._id === order.supplierId
          );
          const storage = storageData.find(
            (storage) => storage._id === order.storageId
          );
          const productIds = order.products.map((product) => product._id);
          const products = productIds
            .map((id) => {
              return productsData.find(({ _id }) => _id === id);
            })
            .map(
              ({ name }, index) =>
                `${name} (${order.products[index].quantity} at ${order.products[index].slotIndex})`
            )
            .join(', ');
          const price = productIds
            .map((id) => {
              return productsData.find(({ _id }) => _id === id);
            })
            .reduce(
              (acc, { price }, index) =>
                acc + price * order.products[index].quantity,
              0
            )
            .toFixed(2);

          return {
            products,
            price,
            status: order.status,
            workerName: worker ? worker.fullName : '',
            customerName: customer ? customer.fullName : '',
            supplierName: supplier ? supplier.supplierName : '',
            storageName: storage ? storage.name : '',
            createdAt: new Date(order.createdAt).toLocaleString(),
          };
        });

        setOrders(newOrders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (_id) => {
    const newData = orders.filter((item) => item._id !== _id);
    setOrders(newData);
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      name: `John Smith ${count}`,
      status: 'New',
      orderDate: new Date().toString(),
      assignedTo: `David ${count}`,
    };
    setOrders([...orders, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...orders];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setOrders(newData);
  };

  const defaultColumns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      editable: true,
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      editable: true,
      render: (tag) => {
        let color = '';
        switch (tag) {
          case 'New':
            color = 'purple';
            break;
          case 'Processing':
            color = 'blue';
            break;
          case 'Sent':
            color = 'cyan';
            break;
          case 'Delivered':
            color = 'green';
            break;
          case 'Cancelled':
            color = 'red';
            break;
          default:
            color = '';
            break;
        }
        return <span>{<Tag color={color}>{tag}</Tag>}</span>;
      },
      filters: [
        {
          text: 'New',
          value: 'New',
        },
        {
          text: 'Processing',
          value: 'Processing',
        },
        {
          text: 'Sent',
          value: 'Sent',
        },
        {
          text: 'Delivered',
          value: 'Delivered',
        },
        {
          text: 'Cancelled',
          value: 'Cancelled',
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      editable: true,
    },
    {
      title: 'Storage',
      dataIndex: 'storageName',
      editable: true,
    },
    {
      title: 'Products',
      dataIndex: 'products',
      editable: true,
    },
    {
      title: 'Assigned To',
      dataIndex: 'workerName',
      editable: true,
      render: (assignedTo) => {
        return <Link to={`workers/${assignedTo}`}>{assignedTo}</Link>;
      },
    },
    { title: 'Price', dataIndex: 'price' },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) =>
        orders.length >= 1 ? (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button>Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className="m-6 w-full">
      <div className="flex items-end mb-4">
        <Statistic
          className="flex-1"
          title="Total orders"
          value={orders.length}
        />
        <Button
          className=""
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add New Order
        </Button>
      </div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={orders}
        columns={columns}
        scroll={{ y: 700 }}
      />
    </div>
  );
};
export default OrderPage;
