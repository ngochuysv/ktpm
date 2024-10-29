import { InputTypeField } from './type';

// Field thông tin khách hàng
export const listFieldCustomer: Array<InputTypeField> = [
  {
    label: 'Họ tên',
    field: 'fullName',
    type: 'INPUT',
    maxLength: 100,
    isRequired: true,
  },
  {
    label: 'Ngày sinh',
    field: 'dateOfBirth',
    type: 'DATE',
    maxLength: 20,
    isRequired: false,
  },
  {
    label: 'Số điện thoại',
    field: 'phoneNumber',
    type: 'INPUT',
    maxLength: 20,
    isRequired: false,
  },
  {
    label: 'Email',
    field: 'email',
    type: 'INPUT',
    maxLength: 250,
    isRequired: false,
  },
];
