import http from "./httpService";
const apiEndpoint = "/returns";

export function saveReturn(rental) {
  return http.post(apiEndpoint, rental);
}
