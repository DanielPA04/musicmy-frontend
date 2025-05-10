export interface IChangePwdDTO {
    email?: string;
    oldPassword?: string;
    newPassword: string;
    token?: string;
  }
  