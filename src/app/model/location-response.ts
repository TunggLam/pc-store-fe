import {Location} from "./location";

export interface LocationResponse {
  error?: string,
  error_text?: string,
  data_name?: string,
  data?: Location[]
}
