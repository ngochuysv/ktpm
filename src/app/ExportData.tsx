/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */

import {
  Button,
  Form,
  Input,
  InputNumber,
  Table,
  TableProps,
  Tooltip,
} from 'antd';
import { useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { listFieldCustomer } from './constant';
import { DataTypeProduct, EditableCellProps, InputTypeField } from './type';

function ExportData(props: { control: any; errors: any, 
  // dataRequest: DataRequest;
// setDataRequest: (data: DataRequest) => void();
 }) {
  const { control, errors } = props;

  const [form] = Form.useForm();
  const [dataTable, setDataTable] = useState<DataTypeProduct[]>();
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

  // column field thông tin sản phầm
  const columnTable = [
    {
      title: 'Mã SP',
      dataIndex: 'id',
      width: 120,
      editable: true,
      isRequired: false,
    },
    {
      title: 'Tên SP',
      dataIndex: 'name',
      width: 200,
      editable: false,
      isRequired: true,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      width: 180,
      editable: false,
      isRequired: true,
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
      editable: false,
      isRequired: true,
    },
    {
      title: '',
      dataIndex: 'actions',
      width: 80,
      editable: false,
      // render: (_: any, record: DataTypeProduct) => {
      //   const editable = isEditing(record);
      //   debugger;
      //   return editable ? (
      //     <span className="grid gap-x-2" key={`${record.id}`}>
      //       <Button
      //         key={`${record.id}_save`}
      //         type="text"
      //         icon={CheckCircleOutlined}
      //         onClick={() => save(record.key)}
      //         style={{ marginInlineEnd: 8 }}
      //       />
      //       <Button
      //         key={`${record.id}_cancel`}
      //         icon={CloseCircleOutlined}
      //         onClick={cancel}
      //       />
      //     </span>
      //   ) : (
      //     <Button
      //       type="text"
      //       key={`${record.id}_edit`}
      //       icon={EditOutlined}
      //       disabled={editingKey !== ""}
      //       onClick={() => edit(record)}
      //     />
      //   );
      // },
    },
  ];

  const getErrorMessageByField = (isRequired: boolean, dataIndex: any) => {
    const valueField = form.getFieldValue(dataIndex);

    if (isRequired && !valueField) {
      return 'Thông tin không được để trống';
    }
    return '';
  };

  const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    // record,
    // index,
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
                  message: `Thông tin không được để trống`,
                },
              ]}
            >
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
    (col: any) => {
      if (!col.editable) {
        return col;
      }

      let inputType = 'INPUT';
      if (['price', 'quantity', 'totalAmount'].includes(col.dataIndex)) {
        inputType = 'NUMBER';
      }
      return {
        ...col,
        onCell: (record: DataTypeProduct) => ({
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

  // const edit = (record: Partial<DataTypeProduct> & { key: React.Key }) => {
  //   // form.setFieldsValue({ name: "", age: "", address: "", ...record });
  //   setEditingKey(record.id as string);
  // };

  // const cancel = () => {
  //   setEditingKey("");
  // };

  // const save = async (key: React.Key) => {
  //   try {
  //     const row = (await form.validateFields()) as DataTypeProduct;

  //     const newData = dataTable?.length ? dataTable : [];
  //     const index = newData.findIndex((item) => key === item.id);
  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, {
  //         ...item,
  //         ...row,
  //       });
  //       setDataTable(newData);
  //       setEditingKey("");
  //     } else {
  //       newData.push(row);
  //       setDataTable(newData);
  //       setEditingKey("");
  //     }
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //   }
  // };

  const handleAdd = () => {
    const newData = dataTable?.length ? dataTable : [];
    const fields = columnTable.map((col: any) => col?.field);
    const objField = Object.fromEntries(
      fields.map((item) => {
        return [item, ''];
      })
    );
    const id = uuidv4();
    newData.push({
      ...objField,
      id,
    });
    setDataTable(newData);
    setEditingKey(id);
  };

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
      </Form>
    </div>
  );
}

export default ExportData;
