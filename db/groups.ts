import * as policies from "./policies";
import * as roles from "./roles";

export interface Group {
    policies: policies.Policy[],
    roles: roles.Role[],
}

