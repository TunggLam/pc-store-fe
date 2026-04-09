import {UserResponse} from "./user-response";

export interface UserListResponse {
  page?: number,
  size?: number,
  total?: number,
  userProfiles?: UserResponse[];
}
