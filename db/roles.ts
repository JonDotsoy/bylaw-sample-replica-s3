import * as policies from "./policies";
import { Role } from "./types/role";

export const S3FullReader: Role = {
    policies: [
        policies.S3ReadFullBuckets,
    ]
}

export const ReaderReports: Role = {
    policies: [
        policies.S3ReadReportFiles
    ]
}

export const WorkerReporter: Role = {
    policies: [
        policies.S3ReadReportFiles,
        policies.S3WriteReportFiles,
    ]
}

export const DBSessionUpdateProfile: Role = {
    policies: [
        policies.DBSessionUpdateProfile,
    ]
}

export const roles: Record<string, Role> = {
    S3FullReader,
    ReaderReports,
    WorkerReporter,
    DBSessionUpdateProfile,
}
