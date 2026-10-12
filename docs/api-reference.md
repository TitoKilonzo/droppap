# API reference

No `/api/v1` endpoints exist yet. They are delivered from Milestone 2 onward. Each endpoint will be documented here with method, path, authentication, required role, request and response schemas, status codes, pagination and error codes.

Error body shape (implemented in `src/lib/errors`):

```json
{ "error": { "code": "FORBIDDEN", "message": "You do not have permission to do this.", "requestId": "req_123" } }
```
