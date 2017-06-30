import request from '../utils/request';

export async function query() {
  return request('http://222.73.203.71:8080/mockjs/1/j_spring_security_logout');
}
