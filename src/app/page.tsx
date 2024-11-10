'use client';

import { Button, Layout, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import ExportData from './ExportData';

import '@/style/global.css';
import { DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { listFieldCustomer } from './constant';
import {
  DataRequest,
  DataTypeProduct,
  fieldDataRequest,
  InputTypeField,
} from './type';
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

  const baseData = {
    fullName: '',
  };

  const [dataRequest, setDataRequest] = useState<DataRequest>(baseData);
  const [dataTable, setDataTable] = useState<DataTypeProduct[]>([]);

  const onSubmit = handleSubmit((data) => {
    console.log('data', data);
  });

  const getLabelByField = (field: string) => {
    return listFieldCustomer.find(
      (item: InputTypeField) => item.field === field
    )?.label;
  };

  const renderInfor = useCallback(() => {
    return (
      <div className="w-full">
        <p className="text-xl font-[600]">Thông tin khách hàng</p>
        {Object.keys(dataRequest)?.map((field: string) => (
          <div className="grid grid-cols-3 p-2" key={field}>
            <div className="col-span-1">{getLabelByField(field)}: </div>
            <div
              className="col-span-2 truncate"
              title={dataRequest[field as fieldDataRequest]?.toString() || '--'}
            >
              {dataRequest[field as fieldDataRequest] || '--'}
            </div>
          </div>
        ))}
        <p className="text-xl font-[600]">Thông tin hóa đơn</p>
        {dataTable?.map((item: DataTypeProduct) => (
          <div
            className="grid grid-cols-3 p-2"
            key={`${item?.name}_${item?.code}_${item?.price}`}
          >
            <div className="col-span-2">
              {item?.name} x {item?.quantity}
            </div>
            <div
              className="col-span-1 truncate"
              title={item?.totalAmount?.toString() || '0'}
            >
              {new Intl.NumberFormat('vi-VN').format(item?.totalAmount) || 0}
            </div>
          </div>
        ))}
        <footer className="grid grid-cols-4 p-2 fixed bottom-0">
          <div className="col-span-1 font-bold text-xl">Tổng: </div>
          <div className="col-span-3 text-right text-red-600 font-bold text-xl">
            {dataTable?.length > 0
              ? new Intl.NumberFormat('vi-VN').format(
                  Number(
                    dataTable?.reduce(
                      (acc, curr) =>
                        Number(acc) + Number(curr?.totalAmount) || 0,
                      0
                    )
                  )
                )
              : 0}
          </div>
        </footer>
      </div>
    );
  }, [dataRequest, dataTable]);

  console.log('dataTable', dataTable);
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
            dataRequest={dataRequest}
            setDataRequest={setDataRequest}
            dataTable={dataTable || []}
            setDataTable={setDataTable}
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
        {renderInfor()}
      </Sider>
    </Layout>
  );
}
