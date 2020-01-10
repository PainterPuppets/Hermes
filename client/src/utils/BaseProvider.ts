import axios, { AxiosRequestConfig } from 'axios';
import csrf from './csrf';

class BaseProvider {
  CSRFToken: string | null;
  constructor() {
    this.CSRFToken = csrf.getCSRFToken();
  }

  get provider() {
    return axios.create({
      withCredentials: true,
      headers: {
        "X-CSRFToken": this.CSRFToken,
      },
    });
  }

  refreshCSRFToken = () => {
    this.CSRFToken = csrf.getCSRFToken();

    return;
  };

  sendDataByBeacon = (url: string, data = null) => {
    /*
     * 1.When you want to use this method, turn off API's CSRF check and ensure user safety
     * 2.The type of param data must be ArrayBufferView, Blob, DOMString, or FormData, or null
     */
    navigator.sendBeacon(url, data);
  };

  setCSRFToken = (token: any) => {
    this.CSRFToken = token;
  }

  getInstance() {
    // for compatibility
    try {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('The method "getInstance()" is deprecated, access the method by BaseProvider directly');
      }
    } catch (e) {

    }

    return this.provider;
  }

  request(...args: any[]) {
    return this.provider.request(...args as [AxiosRequestConfig]);
  }

  get(...args: any[]) {
    return this.provider.get(...args as [string, AxiosRequestConfig | undefined]);
  }

  post(...args: any[]) {
    return this.provider.post(...args as [string, any | undefined, AxiosRequestConfig | undefined]);
  }

  put(...args: any[]) {
    return this.provider.put(...args as [string, any | undefined, AxiosRequestConfig | undefined]);
  }

  patch(...args: any[]) {
    return this.provider.patch(...args as [string, any | undefined, AxiosRequestConfig | undefined]);
  }

  delete(...args: any[]) {
    return this.provider.delete(...args as [string, AxiosRequestConfig | undefined]);
  }

  head(...args: any[]) {
    return this.provider.head(...args as [string, AxiosRequestConfig | undefined]);
  }
}

let baseProvider = new BaseProvider();

export default baseProvider;