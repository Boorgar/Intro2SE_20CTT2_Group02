import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Statistic, Tag } from 'antd';
import { Link } from 'react-router-dom';

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
  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      name: 'Edward King 0',
      status: 'New',
      orderDate: '12/12/2020',
      assignedTo: 'David',
    },
    {
      key: '1',
      name: 'Edward King 0',
      status: 'In Progress',
      orderDate: '12/11/2020',
      assignedTo: 'Chris',
    },
  ]);
  const [count, setCount] = useState(2);
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: 'Customer Name/Supplier Name',
      dataIndex: 'name',
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
          case 'In Progress':
            color = 'blue';
            break;
          case 'Completed':
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
          text: 'In Progress',
          value: 'In Progress',
        },
        {
          text: 'Completed',
          value: 'Completed',
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
      dataIndex: 'orderDate',
      editable: true,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      editable: true,
      render: (assignedTo) => {
        return <Link to={`workers/${assignedTo}`}>{assignedTo}</Link>;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button>Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      name: `John Smith ${count}`,
      status: 'New',
      orderDate: new Date().toString(),
      assignedTo: `David ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
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
          value={dataSource.length}
        />
        <Button
          className=""
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
      </div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};
export default OrderPage;
