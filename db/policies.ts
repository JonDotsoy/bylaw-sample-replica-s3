import { Policy } from "./types/policy"

export const S3ReadFullBuckets: Policy = {
    id: 'S3ReadFullBuckets',
    Statement: [
        {
            Effect: 'Allow',
            Action: [
                "s3:GetObject",
                "s3:GetObjectTags",
                "s3:ListBucket",
            ],
            Resource: [`arn:aws:s3:*:*:*/*`],
        }
    ]
}

export const S3ReadReportFiles: Policy = {
    id: 'S3ReadReportFiles',
    Statement: [
        {
            Effect: 'Allow',
            Action: [
                "s3:GetObject",
                "s3:GetObjectTags",
            ],
            Resource: [`arn:aws:s3:*:*:*/reports/*`]
        }
    ]
}

export const S3WriteReportFiles: Policy = {
    id: 'S3WriteReportFiles',
    Statement: [
        {
            Effect: 'Allow',
            Action: [
                "s3:PutObject",
                "s3:PutObjectTags",
            ],
            Resource: [`arn:aws:s3:*:*:*/reports/*`]
        }
    ]
}

export const DBSessionUpdateProfile: Policy = {
    id: 'DBSessionUpdateProfile',
    Statement: [
        {
            Effect: 'Allow',
            Action: ['db:PutEntry'],
            Resource: ['*'],
            Condition: async (token) => {
                if (!token.getResourceData) return false;
                const resourceData = await token.getResourceData();
                return token.userId === resourceData.ownerId;
            },
        }
    ]
}

export const policies: Record<string, Policy> = {
    S3ReadFullBuckets,
    S3ReadReportFiles,
    S3WriteReportFiles,
    DBSessionUpdateProfile,
}
