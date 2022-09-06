// 비밀번호
export const pwdRegEzp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@$^*])[A-Za-z\d~!@$^*]{8,20}$/;

// 이메일
export const emailRegEzp =
  // eslint-disable-next-line
  /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;

// 휴대전화번호
export const mobileRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
