import React, { FC, useState, useEffect } from 'react';
import {
  Layout,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Divider,
} from 'antd';
import { IndexModelState, ConnectRC, Loading, connect, Dispatch } from 'umi';
import dayjs from 'dayjs';
import { Item } from './data';
import styles from './index.less';

const { Option } = Select;
const { Content, Header, Footer } = Layout;
interface PageProps {
  index: IndexModelState;
  loading: boolean;
  dispatch: Dispatch;
}

interface Values {
  title: string;
  detail: string;
  status: number;
  id?: string;
}

interface CollectionCreateFormProps {
  visible: boolean;
  initialValues: Values;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  onEdit: (values: Item) => void;
}

//弹窗组件，新增或者编辑用
const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  visible,
  initialValues,
  onCreate,
  onCancel,
  onEdit,
}) => {
  const [form] = Form.useForm();
  const { title = '', detail = '', status = 0, id } = initialValues;
  useEffect(() => {
    form.setFields([
      {
        name: 'title',
        value: title,
      },
      {
        name: 'detail',
        value: detail,
      },
      {
        name: 'status',
        value: status,
      },
    ]);
  }, [initialValues]);
  return (
    <Modal
      visible={visible}
      title="编辑信息"
      okText="提交"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            const { title, detail, status } = values;
            form.resetFields();
            if (id) {
              onEdit({
                id: id,
                title: title,
                detail: detail,
                status: status,
              });
            } else {
              onCreate({ title, status, detail });
            }
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="title"
          label="标题"
          initialValue={title}
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="detail"
          label="详情"
          initialValue={title}
          rules={[
            {
              required: true,
              message: 'Please input the detail of collection!',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          initialValue={status}
          className="collection-create-form_last-form-item"
          rules={[
            {
              required: true,
              message: '请您选择状态',
            },
          ]}
        >
          <Select style={{ width: 120 }}>
            <Option value={0}>未开始</Option>
            <Option value={1}>进行中</Option>
            <Option value={2}>已完成</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const IndexPage: ConnectRC<PageProps> = ({ index, loading, dispatch }) => {
  const { data, pageInfo } = index;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [initialValue, setInitialValue] = useState({
    title: '',
    detail: '',
    status: 0,
  });
  let statusMap = new Map([
    [0, <Tag color="orange">未开始</Tag>],
    [1, <Tag color="cyan">进行中</Tag>],
    [2, <Tag color="green">已完成</Tag>],
  ]);

  const onCreate = (values: Values) => {
    dispatch({
      type: 'index/add',
      payload: values,
    });
    setVisible(false);
  };

  const onDelete = (id: string) => {
    const r = window.confirm('确定删除?');
    if (r === true) {
      dispatch({
        type: 'index/delete',
        payload: {
          id,
        },
      });
    }
  };

  const onEdit = (item: Item) => {
    dispatch({
      type: 'index/update',
      payload: item,
    });
    setVisible(false);
  };

  const onChange = (page: number, pageSize: number | undefined): void => {
    dispatch({
      type: 'index/query',
      payload: {
        pageSize,
        pageIndex: page,
      },
    });
  };

  const submit = (): void => {
    form.validateFields().then(values => {
      const data = JSON.parse(
        JSON.stringify(values, function(key, value) {
          if (value !== undefined) {
            return value;
          } else {
            return undefined;
          }
        }),
      );
      dispatch({
        type: 'index/query',
        payload: {
          ...data,
          pageSize: 5,
          pageIndex: 1,
        },
      });
    });
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '15%',
    },
    {
      title: '详情',
      dataIndex: 'detail',
      width: '40%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      render: (t: string, r: Item) => statusMap.get(r.status),
    },
    {
      title: '时间',
      width: '15%',
      dataIndex: 'createdAt',
      render: (t: string) => (
        <span>{dayjs(t).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      width: '15%',
      render: (t: string, r: Item) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                setInitialValue(r);
                setVisible(true);
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                onDelete(r.id);
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Layout>
      <Header className={styles.header}>Easy TodoList</Header>
      <Content className={styles.content}>
        <Row gutter={24}>
          <Col span={8}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
                setInitialValue({ title: '', detail: '', status: 0 });
              }}
            >
              新增
            </Button>
          </Col>
          <Col span={16}>
            <Form
              form={form}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Form.Item name="status">
                <Select
                  style={{ width: 120, marginRight: 16 }}
                  onChange={submit}
                >
                  <Option value="">全部</Option>
                  <Option value={0}>未开始</Option>
                  <Option value={1}>进行中</Option>
                  <Option value={2}>已完成</Option>
                </Select>
              </Form.Item>
              <Form.Item name="title">
                <Input.Search
                  onSearch={submit}
                  placeholder="输入标题关键字"
                  style={{ width: 240 }}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Divider style={{ borderTop: '1px solid #1DA57A' }} />
        <Table
          bordered
          size="large"
          loading={loading}
          dataSource={data}
          pagination={{
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
            current: pageInfo.pageIndex,
            onChange: onChange,
          }}
          columns={columns}
          rowKey="id"
        />
        <CollectionCreateForm
          visible={visible}
          onCreate={onCreate}
          onEdit={onEdit}
          initialValues={initialValue}
          onCancel={() => {
            setVisible(false);
            form.resetFields();
          }}
        />
      </Content>
      <Footer className={styles.footer}>Created By Aushion</Footer>
    </Layout>
  );
};
export default connect(
  ({ index, loading }: { index: IndexModelState; loading: Loading }) => ({
    index,
    loading: loading.models.index,
  }),
)(IndexPage);
