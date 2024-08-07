import axios, { AxiosRequestHeaders } from "axios";

interface CustomAxiosRequestHeaders extends AxiosRequestHeaders {
  token: string;
}

const EXPIRED_TOKEN_CODE = 2;
const PAGE_RELOAD_TIMEOUT = 3 * 1000;
const TIMEOUT = 30 * 1000;
const TOKEN_TYPE: string[] = ["tokenType_1", "tokenType_2"];

const getTokenType = (options): string => {
  const { token = "" } = options;
  if (token === TOKEN_TYPE[1]) return "";
  return "";
};

function main(options) {
  const headers = {
    "Content-Type": "application/json",
  } as CustomAxiosRequestHeaders;

  if (options.token) headers.token = getTokenType(options);
  if (options.contentType) headers["content-type"] = options.contentType;

  if (options.contentType) options.data = options.params;
  if (options.noParams) delete options.params;

  return new Promise((resolve, reject) => {
    const args = {
      headers,
      timeout: TIMEOUT * 1,
    };

    const instance = axios.create(args);

    instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error),
    );

    instance.interceptors.response.use(
      (response) => {
        if (response?.data?.code * 1 === EXPIRED_TOKEN_CODE * 1) {
          setTimeout(() => {
            window.location.reload();
          }, PAGE_RELOAD_TIMEOUT);
        }

        return response;
      },
      (error) => Promise.reject(error),
    );

    instance(options)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

export default main;
