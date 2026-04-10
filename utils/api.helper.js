// utils/api.helper.js
export class ApiHelper {
  /** @param {import('@playwright/test').APIRequestContext} request */
  constructor(request) {
    this.req  = request;
    this.base = process.env.API_BASE_URL || 'https://opensource-demo.orangehrmlive.com';
  }

  async get(path, params = {}) {
    const r = await this.req.get(`${this.base}${path}`, { params });
    return r.json();
  }

  async post(path, data) {
    const r = await this.req.post(`${this.base}${path}`, {
      data,
      headers: { 'Content-Type': 'application/json' },
    });
    return r.json();
  }

  async put(path, data) {
    const r = await this.req.put(`${this.base}${path}`, { data });
    return r.json();
  }

  async delete(path) {
    return this.req.delete(`${this.base}${path}`);
  }
}
