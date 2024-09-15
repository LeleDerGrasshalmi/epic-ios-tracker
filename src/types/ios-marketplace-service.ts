export interface IOSMarketplaceUpdateData {
  updates: Update[]
  failures: Failure[]
}

export interface Update {
  appleItemId: string
  appleVersionId: string
  alternativeDistributionPackage: string
  bundleVersion: string
  shortVersionString: string
  installVerificationToken: string
}

export interface Failure {
  appleItemId: string
  appleVersionId: string
  failure: FailureReason
}

export interface FailureReason {
  code: number
  description: string
}
