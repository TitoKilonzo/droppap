CREATE TABLE `department_memberships` (
	`id` text PRIMARY KEY NOT NULL,
	`department_id` text NOT NULL,
	`membership_id` text NOT NULL,
	`department_role` text DEFAULT 'member' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `department_memberships_unique` ON `department_memberships` (`department_id`,`membership_id`);--> statement-breakpoint
CREATE INDEX `department_memberships_membership_idx` ON `department_memberships` (`membership_id`);--> statement-breakpoint
CREATE TABLE `departments` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departments_org_slug_unique` ON `departments` (`organization_id`,`slug`);--> statement-breakpoint
CREATE TABLE `memberships` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`user_id` text NOT NULL,
	`organization_role` text DEFAULT 'employee' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`invited_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`invited_by`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `memberships_org_user_unique` ON `memberships` (`organization_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `memberships_user_idx` ON `memberships` (`user_id`);--> statement-breakpoint
CREATE INDEX `memberships_org_role_idx` ON `memberships` (`organization_id`,`organization_role`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`storage_quota_bytes` integer DEFAULT 5368709120 NOT NULL,
	`storage_used_bytes` integer DEFAULT 0 NOT NULL,
	`storage_reserved_bytes` integer DEFAULT 0 NOT NULL,
	`trash_retention_days` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);--> statement-breakpoint
CREATE INDEX `organizations_status_idx` ON `organizations` (`status`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified_at` integer,
	`avatar_key` text,
	`account_status` text DEFAULT 'active' NOT NULL,
	`platform_role` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`email` text NOT NULL,
	`organization_role` text DEFAULT 'employee' NOT NULL,
	`department_id` text,
	`token_hash` text NOT NULL,
	`invited_by_membership_id` text,
	`expires_at` integer NOT NULL,
	`accepted_at` integer,
	`revoked_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`invited_by_membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invitations_token_hash_unique` ON `invitations` (`token_hash`);--> statement-breakpoint
CREATE INDEX `invitations_org_email_idx` ON `invitations` (`organization_id`,`email`);--> statement-breakpoint
CREATE TABLE `password_credentials` (
	`user_id` text PRIMARY KEY NOT NULL,
	`password_hash` text NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_tokens_hash_unique` ON `password_reset_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX `password_reset_tokens_user_idx` ON `password_reset_tokens` (`user_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`revoked_at` integer,
	`last_seen_at` integer,
	`user_agent` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `file_tags` (
	`file_id` text NOT NULL,
	`tag_id` text NOT NULL,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `file_tags_unique` ON `file_tags` (`file_id`,`tag_id`);--> statement-breakpoint
CREATE INDEX `file_tags_tag_idx` ON `file_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `file_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`file_id` text NOT NULL,
	`version_number` integer NOT NULL,
	`object_key` text NOT NULL,
	`original_filename` text NOT NULL,
	`detected_content_type` text,
	`declared_content_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`checksum` text,
	`uploaded_by_membership_id` text NOT NULL,
	`scan_status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by_membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `file_versions_file_number_unique` ON `file_versions` (`file_id`,`version_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `file_versions_object_key_unique` ON `file_versions` (`object_key`);--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`department_id` text,
	`folder_id` text,
	`owner_membership_id` text NOT NULL,
	`display_name` text NOT NULL,
	`description` text,
	`current_version_id` text,
	`visibility` text DEFAULT 'private' NOT NULL,
	`lifecycle_status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`owner_membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `files_org_status_idx` ON `files` (`organization_id`,`lifecycle_status`);--> statement-breakpoint
CREATE INDEX `files_org_folder_idx` ON `files` (`organization_id`,`folder_id`);--> statement-breakpoint
CREATE INDEX `files_org_department_idx` ON `files` (`organization_id`,`department_id`);--> statement-breakpoint
CREATE INDEX `files_org_owner_idx` ON `files` (`organization_id`,`owner_membership_id`);--> statement-breakpoint
CREATE INDEX `files_org_name_idx` ON `files` (`organization_id`,`display_name`);--> statement-breakpoint
CREATE INDEX `files_org_created_idx` ON `files` (`organization_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`department_id` text,
	`parent_folder_id` text,
	`name` text NOT NULL,
	`created_by_membership_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`parent_folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`created_by_membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `folders_org_parent_idx` ON `folders` (`organization_id`,`parent_folder_id`);--> statement-breakpoint
CREATE INDEX `folders_org_department_idx` ON `folders` (`organization_id`,`department_id`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_org_name_unique` ON `tags` (`organization_id`,`name`);--> statement-breakpoint
CREATE TABLE `upload_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`file_id` text,
	`version_id` text,
	`object_key` text NOT NULL,
	`expected_size_bytes` integer NOT NULL,
	`declared_content_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`expires_at` integer NOT NULL,
	`created_by_membership_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`version_id`) REFERENCES `file_versions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `upload_sessions_object_key_unique` ON `upload_sessions` (`object_key`);--> statement-breakpoint
CREATE INDEX `upload_sessions_status_expires_idx` ON `upload_sessions` (`status`,`expires_at`);--> statement-breakpoint
CREATE INDEX `upload_sessions_org_idx` ON `upload_sessions` (`organization_id`);--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`resource_type` text NOT NULL,
	`resource_id` text NOT NULL,
	`principal_type` text NOT NULL,
	`principal_id` text NOT NULL,
	`permission_level` text NOT NULL,
	`granted_by_membership_id` text NOT NULL,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`granted_by_membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `permissions_grant_unique` ON `permissions` (`resource_type`,`resource_id`,`principal_type`,`principal_id`);--> statement-breakpoint
CREATE INDEX `permissions_resource_idx` ON `permissions` (`organization_id`,`resource_type`,`resource_id`);--> statement-breakpoint
CREATE INDEX `permissions_principal_idx` ON `permissions` (`organization_id`,`principal_type`,`principal_id`);--> statement-breakpoint
CREATE TABLE `share_links` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`file_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`permission_level` text DEFAULT 'view' NOT NULL,
	`expires_at` integer NOT NULL,
	`max_downloads` integer,
	`download_count` integer DEFAULT 0 NOT NULL,
	`revoked_at` integer,
	`created_by_membership_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `share_links_token_hash_unique` ON `share_links` (`token_hash`);--> statement-breakpoint
CREATE INDEX `share_links_file_idx` ON `share_links` (`file_id`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text,
	`actor_user_id` text,
	`actor_membership_id` text,
	`action` text NOT NULL,
	`resource_type` text NOT NULL,
	`resource_id` text NOT NULL,
	`outcome` text NOT NULL,
	`request_id` text NOT NULL,
	`metadata_json` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`actor_membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `audit_logs_org_created_idx` ON `audit_logs` (`organization_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `audit_logs_actor_idx` ON `audit_logs` (`actor_user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `audit_logs_resource_idx` ON `audit_logs` (`resource_type`,`resource_id`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`recipient_membership_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`resource_type` text,
	`resource_id` text,
	`read_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipient_membership_id`) REFERENCES `memberships`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `notifications_recipient_idx` ON `notifications` (`recipient_membership_id`,`read_at`,`created_at`);