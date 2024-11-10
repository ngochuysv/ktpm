import { Dayjs } from 'dayjs';
import React from 'react';

export type InputType = 'INPUT' | 'NUMBER' | 'SELECT' | 'DATE' | 'BUTTON';

export interface InputTypeField {
  label: string;
  field: string;
  placeholder?: string;
  type: InputType;
  isRequired?: boolean;
  maxLength?: number;
  maxValue?: number;
  minValue?: number;
  maxDate?: Dayjs;
  disabled?: boolean;
}

// Thông tin hàng hóa
export interface DataTypeProduct {
  id: string;
  code: string;
  name: string;
  price: number | 0;
  quantity?: number | 0;
  totalAmount: number | 0;
}

// Thông tin khách hàng
export type DataRequest = {
  fullName?: string;
  phoneNumber?: number;
  email?: string;
  dateOfBirth?: string;
  listProduct?: DataTypeProduct[];
};

export type fieldDataRequest = keyof Omit<DataRequest, 'listProduct'>;

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: InputType;
  record: DataTypeProduct;
  index: number;
  isRequired: boolean;
}
