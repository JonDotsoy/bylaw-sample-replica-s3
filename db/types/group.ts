import { Policy } from "./policy";
import { Role } from "./role";

export interface Group {
    policies: Policy[];
    roles: Role[];
}
