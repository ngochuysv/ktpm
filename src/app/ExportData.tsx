/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  TableProps,
  Tooltip,
} from 'antd';
import { useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { listFieldCustomer, listProduct } from './constant';
import {
  DataRequest,
  DataTypeProduct,
  EditableCellProps,
  InputTypeField,
} from './type';

function ExportData(props: {
  control: any;
  errors: any;
  dataRequest: DataRequest;
  setDataRequest: (data: DataRequest) => void;
  dataTable: any;
  setDataTable: (data: any) => void;
}) {
  const {
    control,
    errors,
    dataRequest,
    setDataRequest,
    dataTable,
    setDataTable,
  } = props;

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: DataTypeProduct) => record.id === editingKey;

  const renderInput = (config: InputTypeField) => {
    return (
      <Controller
        name={config.field}
        control={control}
        render={({ field: { onChange, onBlur, ...rest } }) => (
          <div className="w-full">
            <div className="my-2">
              <span>{config.label}</span>
              {config.isRequired ? (
                <span className="text-red-600">
                  <b>*</b>
                </span>
              ) : (
                ''
              )}
            </div>
            <Input
              {...rest}
              placeholder={config.placeholder}
              maxLength={config.maxLength}
              disabled={config.disabled}
              onChange={({ target }) => {
                onChange(target.value);
                setDataRequest({
                  ...dataRequest,
                  [config.field]: target.value,
                });
              }}
              onBlur={({ target }) => {
                onBlur();
                onChange(target.value.trim());
              }}
              status={errors[config.field] && 'error'}
            />
            {errors[config.field] && (
              <p className="text-red-600">{errors[config.field]?.message}</p>
            )}
          </div>
        )}
      />
    );
  };

  // ============= EDIT TABLE ==================

  const edit = (record: DataTypeProduct) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    const newData = dataTable?.length ? dataTable : [];
    const index = newData.findIndex((item: any) => editingKey === item.id);
    const row = newData.find((item: any) => editingKey === item.id);

    if (row) {
      if (index > -1) {
        newData.splice(index, 1);
        setDataTable(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setDataTable(newData);
        setEditingKey('');
      }
      form.resetFields();
    }
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataTypeProduct;

      const newData = dataTable?.length ? dataTable : [];
      const index = newData.findIndex((item: any) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataTable(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setDataTable(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleAdd = () => {
    const newData = dataTable?.length ? dataTable : [];

    const id = uuidv4();
    newData.push({
      id,
      code: '',
      name: '',
      price: 0,
      quantity: 0,
      totalAmount: 0,
    });
    setDataTable(newData);
    setEditingKey(id);
  };

  // parseData
  const parseData = useCallback(
    (record: any, field: string) => {
      if (['price', 'quantity', 'totalAmount'].includes(field)) {
        return (
          <span>
            {new Intl.NumberFormat('vi-VN').format(record[field]) || 0}
          </span>
        );
      }
      return (
        <span title={record[field]?.toString()} className="truncate">
          {record[field] || '--'}
        </span>
      );
    },
    [dataTable, editingKey]
  );

  // column field thông tin sản phầm
  const columnTable = [
    {
      title: 'Mã SP',
      dataIndex: 'code',
      width: 200,
      editable: true,
      isRequired: true,
    },
    {
      title: 'Tên SP',
      dataIndex: 'name',
      width: 200,
      editable: true,
      isRequired: true,
      render: (_: any, record: DataTypeProduct) => parseData(record, 'name'),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      width: 180,
      editable: true,
      isRequired: true,
      render: (_: any, record: DataTypeProduct) => parseData(record, 'price'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 100,
      editable: true,
      isRequired: true,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalAmount',
      width: 180,
      editable: true,
      isRequired: true,
      render: (_: any, record: DataTypeProduct) =>
        parseData(record, 'totalAmount'),
    },
    {
      title: '',
      dataIndex: 'actions',
      width: 80,
      editable: false,
      render: (_: any, record: DataTypeProduct) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="grid grid-cols-2 gap-x-2" key={`${record.id}`}>
            <Button
              key={`${record.id}_save`}
              type="text"
              title="Lưu"
              icon={<CheckCircleOutlined />}
              onClick={() => save(record.id)}
              style={{ marginInlineEnd: 8 }}
            />
            <Button
              key={`${record.id}_cancel`}
              type="text"
              title="Hủy"
              icon={<CloseCircleOutlined />}
              onClick={cancel}
            />
          </span>
        ) : (
          <Button
            type="text"
            title="Cập nhật"
            key={`${record.id}_edit`}
            icon={<EditOutlined />}
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          />
        );
      },
    },
  ];

  const getErrorMessageByField = (isRequired: boolean, dataIndex: any) => {
    const valueField = form.getFieldValue(dataIndex);

    if (isRequired && !valueField) {
      return 'Thông tin không được để trống';
    }
    return '';
  };

  const removeVietnameseAccents = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
      .replace(/đ/g, 'd') // bỏ chữ đ
      .replace(/Đ/g, 'D'); // bỏ chữ Đ
  };

  const filterOptionSelect = (input: string, option: any) =>
    removeVietnameseAccents(option?.label ?? '')
      .toLowerCase()
      .includes(removeVietnameseAccents(input).toLowerCase());

  const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    // record,
    index,
    isRequired,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Tooltip
            color="#fa4549"
            title={getErrorMessageByField(isRequired, dataIndex)}
          >
            <Form.Item
              name={dataIndex}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: ``,
                },
              ]}
            >
              {inputType === 'SELECT' && (
                <Select
                  options={listProduct.map((item: any) => ({
                    label: `${item?.code} - ${item?.name}`,
                    value: item?.code,
                  }))}
                  showSearch
                  autoFocus={index === 0}
                  filterOption={filterOptionSelect}
                  onChange={(value) => {
                    const itemSelected = listProduct.find(
                      (item) => item.code === value
                    );
                    form.setFieldValue('name', itemSelected?.name);
                    form.setFieldValue('price', itemSelected?.price);
                  }}
                />
              )}
              {inputType === 'INPUT' && (
                <Input
                  onChange={({ target }) =>
                    form.setFieldsValue({
                      [dataIndex]: target.value,
                    })
                  }
                  onBlur={() =>
                    form.setFieldsValue({
                      [dataIndex]: form.getFieldValue(dataIndex)?.trim(),
                    })
                  }
                  disabled={['name', 'price', 'totalAmount'].includes(
                    dataIndex
                  )}
                />
              )}
              {inputType === 'NUMBER' && (
                <InputNumber<number>
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) =>
                    value?.replace(/\$\s?|(,*)/g, '') as unknown as number
                  }
                  min={0}
                  placeholder={title}
                  className="w-full"
                  disabled={['name', 'price', 'totalAmount'].includes(
                    dataIndex
                  )}
                  onBlur={(e) => {
                    if (dataIndex === 'quantity') {
                      const price = form.getFieldValue('price');
                      form.setFieldValue(
                        'totalAmount',
                        Number(e.target.value || 0) * Number(price || 0)
                      );
                    }
                  }}
                />
              )}
            </Form.Item>
          </Tooltip>
        ) : (
          children
        )}
      </td>
    );
  };

  const mergedColumns: TableProps<DataTypeProduct>['columns'] = columnTable.map(
    (col: any, index: number) => {
      if (!col.editable) {
        return col;
      }

      let inputType = 'INPUT';
      if (['price', 'quantity', 'totalAmount'].includes(col.dataIndex)) {
        inputType = 'NUMBER';
      }
      if (col.dataIndex === 'code') {
        inputType = 'SELECT';
      }
      return {
        ...col,
        onCell: (record: DataTypeProduct) => ({
          index,
          record,
          inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          isRequired: col.isRequired,
          editing: isEditing(record),
        }),
      };
    }
  );

  const actionHeaderTable = useCallback(
    () => (
      <div>
        <Button type="primary" onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
      </div>
    ),
    [dataTable, editingKey]
  );

  // ============= EDIT TABLE ==================

  const renderTable = useCallback(() => {
    return (
      <Table
        components={{
          body: { cell: EditableCell },
        }}
        bordered
        dataSource={dataTable}
        columns={mergedColumns}
        rowClassName="editable-row"
        title={actionHeaderTable}
        pagination={false}
      />
    );
  }, [dataTable, editingKey]);

  return (
    <div className="">
      <p className="text-xl font-[600]">Thông tin khách hàng</p>
      <div className="grid grid-cols-4 gap-x-3 mb-4">
        {listFieldCustomer.map((item: InputTypeField) => (
          <div key={item.field} className="col-span-1">
            {renderInput(item)}
          </div>
        ))}
      </div>

      <p className="text-xl font-[600] mb-3">Thông tin mua hàng</p>
      <Form form={form} component={false}>
        {renderTable()}
      </Form>
    </div>
  );
}

export default ExportData;
