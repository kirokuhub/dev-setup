import getUrl from "../helpers/getUrl";
import request from "../request/index";

export const queryTime = (params = {}) => {
  const path = "http://worldtimeapi.org/api/timezone/Asia/Hong_Kong";
  const url = getUrl(path);
  const args = { url, params };
  return request(args);
};

export const del = () => {};
