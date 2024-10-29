'use client';

import { Button, Layout, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import ExportData from './ExportData';

import '@/style/global.css';
import { DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DataRequest } from './type';
import { validateDataRequest } from './validate';

export default function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DataRequest>({ resolver: zodResolver(validateDataRequest) });

  // const baseData = {
  //   fullName: '',
  // };

  // const [dataRequest, setDataRequest] = useState<DataRequest>(baseData);

  const onSubmit = handleSubmit((data) => {
    console.log('data', data);
  });

  return (
    <Layout className="main">
      <Layout>
        <Content
          style={{
            padding: 24,
            minHeight: '100vh',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="size-full"
        >
          <ExportData
            control={control}
            errors={errors}
            // dataRequest={dataRequest}
            // setDataRequest={setDataRequest}
          />
        </Content>
      </Layout>
      <Sider trigger={null} width="25%">
        <Header className="p-4">
          <div className="flex gap-x-2 text-right">
            <Button
              color="danger"
              variant="solid"
              size="large"
              icon={<DeleteOutlined />}
            >
              XÓA
            </Button>
            <Button
              color="primary"
              variant="solid"
              size="large"
              icon={<PrinterOutlined />}
              onClick={onSubmit}
            >
              IN HÓA ĐƠN
            </Button>
          </div>
        </Header>
        <div className="w-full">
          <p className="text-xl font-[600]">Thông tin khách hàng</p>
          <div className="grid grid-cols-2">{}</div>
          <p className="text-xl font-[600]">Thông tin hóa đơn</p>
        </div>
      </Sider>
    </Layout>
  );
}
