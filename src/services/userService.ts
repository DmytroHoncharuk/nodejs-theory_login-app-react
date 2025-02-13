import { httpClient } from '../http/httpClient';

export const userService = {
  getUser: (id:number) => httpClient.get(`profile/${id}`),
  changeName: (newName:string) => httpClient.patch('profile/name', {newName}),
  changeEmail: (password:string, newEmail:string) => httpClient.patch('/profile/email', {password, newEmail}),
  changePassword: (oldPassword:string, newPassword:string, confirmPassword:string) => httpClient.patch('/profile/password', {oldPassword, newPassword, confirmPassword})
};

