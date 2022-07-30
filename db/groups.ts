import { Group } from "./types/group";


export const Admin: Group = {
    policies: [],
    roles: [],
}

export const groups: Record<string, Group> = { Admin }
