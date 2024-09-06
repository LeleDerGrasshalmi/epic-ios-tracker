export interface AppManifestData {
  manifestSchemaVersion: string;
  distributionPackageRevision: number;
  appleItemId: string;
  bundleId: string;
  shortVersionString: string;
  bundleVersion: string;
  appleVersionId: string;
  platforms: string[];
  minimumSystemVersions: MinimumSystemVersions;
  requiredDeviceCapabilities: string[];
  appInstallDeterminants: unknown[];
  hasMessagesExtension: boolean;
  isLaunchProhibited: boolean;
  variants: Variant[];
  deltas: Delta[];
}

export interface MinimumSystemVersions {
  ios: string;
}

export interface Variant {
  publicId: string;
  assetPath: string;
  installTargets: InstallTarget[];
  variantDetails: VariantDetails;
}

export interface InstallTarget {
  device: string;
  os: string;
}

export interface VariantDetails {
  compressedSize: number;
  uncompressedSize: number;
  hashes: Hash[];
}

export interface Hash {
  algorithm: string;
  chunkSize: number;
  encryptedChunkDigests: string[];
}

export interface Delta {
  publicId: string;
  assetPath: string;
  sourceVariant: SourceVariant;
  targetVariantAssetPath: string;
  deltaDetails: DeltaDetails;
}

export interface SourceVariant {
  installTargets: InstallTarget2[];
  appleVersionId: string;
  version: string;
}

export interface InstallTarget2 {
  device: string;
  os: string;
}

export interface DeltaDetails {
  compressedSize: number;
  uncompressedSize: number;
  hashes: Hash2[];
}

export interface Hash2 {
  algorithm: string;
  chunkSize: number;
  encryptedChunkDigests: string[];
}
