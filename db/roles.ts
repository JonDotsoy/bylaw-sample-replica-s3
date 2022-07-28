import * as policies from "./policies";

export interface Role {
    policies: policies.Policy[],
}

export const S3FullReader: Role = {
    policies: [
        policies.s3ReadFullBuckets,
    ]
}
