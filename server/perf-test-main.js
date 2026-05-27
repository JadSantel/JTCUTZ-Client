import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000/api';
const PASSWORD = 'TestPassword123!';
const TIME_SLOTS = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
];
const RUN_DAY_OFFSET = Date.now() % 1000;

function futureDate(daysFromNow) {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
}

export const options = {
  vus: 10,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;
  const user = {
    name: `Perf Test User ${uniqueId}`,
    email: `perf-test-${uniqueId}@example.com`,
    phone: '1234567890',
    password: PASSWORD,
  };

  let authToken = '';

  // Group 1: Health Check
  group('Health Check', () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 100ms': (r) => r.timings.duration < 100,
    });
  });

  sleep(1);

  // Group 2: Authentication - Register
  group('Auth - Register', () => {
    const payload = JSON.stringify(user);

    const res = http.post(`${BASE_URL}/auth/register`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
      'status is 201': (r) => r.status === 201,
      'register returns token': (r) => Boolean(r.json('token')),
      'response time < 500ms': (r) => r.timings.duration < 500,
    });

    authToken = res.json('token') || '';
  });

  sleep(1);

  // Group 3: Authentication - Login
  group('Auth - Login', () => {
    const payload = JSON.stringify({
      email: user.email,
      password: user.password,
    });

    const res = http.post(`${BASE_URL}/auth/login`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
      'login returns token': (r) => Boolean(r.json('token')),
      'response time < 300ms': (r) => r.timings.duration < 300,
    });

    authToken = res.json('token') || authToken;
  });

  sleep(1);

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };

  // Group 4: Appointments - List Mine
  group('Appointments - List', () => {
    const res = http.get(`${BASE_URL}/appointments/my`, authHeaders);

    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
      'has appointments array': (r) => Array.isArray(r.json('appointments')),
    });
  });

  sleep(1);

  // Group 5: Appointments - Create
  group('Appointments - Create', () => {
    const time = TIME_SLOTS[(__VU + __ITER) % TIME_SLOTS.length];
    const date = futureDate(RUN_DAY_OFFSET + 1 + __VU + __ITER * TIME_SLOTS.length);
    const payload = JSON.stringify({
      service: 'Haircut',
      date,
      time,
      notes: 'Performance test appointment',
    });

    const res = http.post(`${BASE_URL}/appointments`, payload, authHeaders);

    check(res, {
      'status is 201': (r) => r.status === 201,
      'created appointment returned': (r) => Boolean(r.json('appointment')),
      'response time < 800ms': (r) => r.timings.duration < 800,
    });
  });

  sleep(1);

  // Group 6: Gallery - Get
  group('Gallery - List', () => {
    const res = http.get(`${BASE_URL}/gallery`);

    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
  });

  sleep(1);
}
