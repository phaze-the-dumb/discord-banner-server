# Discord Profile Server

`GET /api/v1/profile`

Query:
- id: User id

Example Response:
```json
{
    "banner_url": "https://i.phazed.xyz/?bOeJ6XPM72-9a.jpg",
    "id": "123456789012345"
}
```

`POST /api/v1/banner`

Query:
- id: User id

Body:
- file: Base64 encoded image
- name: file name

Example Response:
```json
{ "ok": true }
```