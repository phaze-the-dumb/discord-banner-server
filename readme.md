# Discord Profile Server

`GET /api/v1/profile`

Query:
- id: User id

Example Response:
```json
{
    "banner_url": "https://i.phazed.xyz/?bOeJ6XPM72-9a.jpg",
    "id": "123456789012345",
    "background_colour": "#000 or linear-gradient(#000, #fff)",
    "foreground_colour": "#000 or linear-gradient(#000, #fff)",
    "has_shadow": true
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

`DELETE /api/v1/banner`

Query:
- User id

Example Response:
```json
{ "ok": true }
```

`POST /api/v1/profile`

Query:
- id: User id

Body:
- background colour: not required, won't be updated if no value passed ( #000 or linear-gradient(#000, #fff) )
- foreground colour: not required, won't be updated if no value passed ( #000 or linear-gradient(#000, #fff) )
- shadow: not required, won't be updated if no value passed ( true / false )

Example Response:
```json
{ "ok": true }
```