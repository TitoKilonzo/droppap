export const ORGANIZATION_ROLES = ["owner", "admin", "department_head", "employee", "read_only"] as const;
export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export const DEPARTMENT_ROLES = ["head", "member"] as const;
export type DepartmentRole = (typeof DEPARTMENT_ROLES)[number];

export const PLATFORM_ROLES = ["platform_admin"] as const;
export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export const MEMBERSHIP_STATUSES = ["invited", "active", "suspended", "removed"] as const;
export const ORGANIZATION_STATUSES = ["active", "suspended", "closed"] as const;
export const ACCOUNT_STATUSES = ["active", "disabled"] as const;

export const FILE_VISIBILITIES = ["private", "department", "organization"] as const;
export const FILE_LIFECYCLE_STATUSES = ["pending", "active", "trashed", "purged"] as const;
export const SCAN_STATUSES = ["pending", "clean", "infected", "skipped", "failed"] as const;
export const UPLOAD_SESSION_STATUSES = ["pending", "completed", "expired", "aborted", "failed"] as const;

export const RESOURCE_TYPES = ["file", "folder"] as const;
export const PRINCIPAL_TYPES = ["membership", "department", "organization"] as const;
export const PERMISSION_LEVELS = ["view", "edit", "manage"] as const;
export const SHARE_LINK_PERMISSION_LEVELS = ["view"] as const;

export const AUDIT_OUTCOMES = ["success", "denied", "failure"] as const;

export const DEFAULT_STORAGE_QUOTA_BYTES = 5 * 1024 ** 3;
