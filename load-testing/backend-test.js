import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 40 },
    { duration: '60s', target: 60 },
    { duration: '60s', target: 80 },
    { duration: '60s', target: 120 },
    { duration: '30s', target: 60 },
    { duration: '30s', target: 30 },
  ],
};

const base_url = 'http://34.160.178.80:8080';
// const base_url = 'http://localhost:8080';

const clients_url = `${base_url}/api/users/clients`;
const providers_url = `${base_url}/api/users/providers`;
const login_url = `${base_url}/api/users/login`;

const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export function setup() {
  const get_res = http.get(clients_url);

  const get_list = get_res.json();
  console.log(get_list.length)
}

function randomString(length, charset = '') {
  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
  let res = '';
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}

function randomNumber(length, charset = '') {
  if (!charset) charset = '0123456789';
  let res = '';
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}

function register(email, phone){
  const payload_obj = {
    email: email,
    password: "pass1",
    phone: phone,
    name: "Frodo Baggins",
    birthDate: "2023-02-02T09:47:23.937+00:00"
  }

  
  const payload = JSON.stringify(payload_obj);
  // console.log(payload)

  const post_res = http.post(clients_url, payload, params);

  // console.log(post_res.json())

  check(post_res, {
    'is status 200': (r) => r.status === 200,
  });

  return post_res.json()
}

function login(email){
  const payload_obj = {
    email: email,
    password: "pass1",
  }


  const login_res = http.get(login_url + `?email=${payload_obj.email}&password=${payload_obj.password}`);
  // console.log(login_res.json())
  check(login_res, {
    'is status 200': (r) => r.status === 200,
  });

  return login_res
}

function get_client(id, params_client, user_email){
  const client_get = http.get(clients_url + `/${id}`, params_client);

  // console.log(client_get);

  check(client_get, {
    'is status 200': (r) => r.status === 200 && r.json().email === user_email,
  });

  return client_get
}

function get_provider_for_type(params_client, type){
  const providers_get = http.get(providers_url + `?typeId=${type}`, params_client);

  // check(providers_get, {
  //   'is status 200': (r) => r.status === 200,
  // });
  // console.log(providers_get.json());
}


export default function () {
  const user_email = randomString(16) + '@mail.com';
  const user_phone = randomNumber(16)

  const register_res = register(user_email, user_phone)

  sleep(1);

  const login_res = login(user_email)

  const id = login_res.json().id;
  const token = login_res.json().token;
  // console.log(id);
  // console.log(token);

  const params_client = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  };

  get_client(id, params_client, user_email)
  sleep(1);

  get_provider_for_type(params_client, "1")
  sleep(1);


  // const get_res = http.get('http://localhost:8080/api/users/clients');

  // const get_list = get_res.json();
  // console.log(get_list.length)
}

export function teardown(data) {
  const get_res = http.get(`${base_url}/api/users/clients`);

  const get_list = get_res.json();
  console.log(get_list.length)

}