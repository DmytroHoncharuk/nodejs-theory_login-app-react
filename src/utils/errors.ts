import { AxiosError } from 'axios';

export type ChangeEmailError = AxiosError<{ message?: string; errors?: { password?: string; newEmail?: string } }>

export type ChangePasswordError = AxiosError<{
  message?: string;
  errors?: {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }
}>;

