import { Policy } from "./policy";
import { Role } from "./role";
import { Group } from "./group";


export interface User {
    policies: Policy[];
    roles: Role[];
    groups: Group[];
}
