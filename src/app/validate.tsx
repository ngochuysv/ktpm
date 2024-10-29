import { z } from "zod";

export const validateDataRequest = z.object({
  fullName: z
    .string({
      required_error: "Thông tin không được để trống",
      invalid_type_error: "Thông tin không được để trống",
    })
    .refine((value) => value.trim().length > 0, {
      message: "Thông tin không được để trống",
    }),
  phoneNumber: z.any(),
  email: z.any(),
  dateOfBirth: z.any(),
});
