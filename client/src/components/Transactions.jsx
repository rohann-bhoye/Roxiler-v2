import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Table, Input, message, Image, Card, Space, Typography } from 'antd';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

const columns = [
    {
        title: "#",
        dataIndex: "id",
        width: 50,
        align: 'center',
    },
    {
        title: "Title",
        dataIndex: "title",
        width: 200,
    },
    {
        title: "Price ($)",
        dataIndex: "price",
        render: (price) => `$${parseFloat(price).toFixed(2)}`,
        width: 100,
        align: 'right'
    },
    {
        title: "Description",
        dataIndex: "description",
    },
    {
        title: "Category",
        dataIndex: "category",
        width: 120,
    },
    {
        title: "Sold",
        dataIndex: "sold",
        render: (sold) => sold ? "✔ Yes" : "✖ No",
        width: 80,
        align: 'center'
    },
    {
        title: "Date",
        dataIndex: "dateOfSale",
        render: (date) => moment(date).format("DD MMM YYYY"),
        width: 120,
        align: 'center'
    },
    {
        title: "Image",
        dataIndex: "image",
        render: (url) => <Image src={url} alt="Product" width={50} height={50} />,
        width: 100,
        align: 'center'
    }
];

function Transactions({ month, monthText }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        }
    });

    const getData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://roxiler-pvpf.onrender.com/transactions`, {
                params: {
                    month,
                    page: tableParams.pagination.current,
                    limit: tableParams.pagination.pageSize,
                    search: tableParams.search
                }
            });
            
            setData(data.transactions);
            setTableParams(prev => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: data.totalCount,
                }
            }));
            message.success('Data loaded successfully');
        } catch (error) {
            console.error(error);
            message.error('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [JSON.stringify(tableParams), month]);

    const handleTableChange = (pagination) => {
        setTableParams({ ...tableParams, pagination });
    };

    const handleSearch = (value) => {
        setTableParams(prev => ({ ...prev, search: value }));
        getData();
    };

    return (
        <Card style={{ margin: 20, padding: 20, borderRadius: 10 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 10 }}>
                    Transactions for {monthText}
                </Title>
                <Search
                    placeholder="Search transactions..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    onSearch={handleSearch}
                    style={{ width: 300, marginBottom: 20 }}
                />
                <Table
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={data}
                    pagination={tableParams.pagination}
                    loading={loading}
                    onChange={handleTableChange}
                    size='small'
                    bordered
                    scroll={{ y: 500 }}
                />
            </Space>
        </Card>
    );
}

export default Transactions;