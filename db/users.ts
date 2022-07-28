import * as policies from "./policies";
import * as roles from "./roles";
import * as groups from "./groups";


export interface User {
    policies: policies.Policy[],
    roles: roles.Role[],
    groups: groups.Group[],
}

