# Security

Implemented in Milestone 1:
- Security headers on all routes (nosniff, frame deny, referrer policy, permissions policy, HSTS).
- Environment validation that fails closed in production.
- Server-generated, organization-prefixed object keys; the client filename is never part of a key.
- Hash-only storage design for sessions, invitations, reset tokens and share links (columns exist; logic arrives later).
- Error responses never expose internal messages.

Planned, not yet implemented: authentication and Argon2id hashing, CSRF defenses, rate limiting, Content Security Policy with tests, upload verification and malware scanning policy, audit logging, share-link enforcement, service worker cache rules (no authenticated data cached).

Report vulnerabilities privately to the project owner.
