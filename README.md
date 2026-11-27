# Empire Auto Group website

- `public/` — the website (`index.html`) and the private inventory admin (`admin/`).
- `netlify/functions/` — the small backend that stores inventory and photos (Netlify Blobs).

## Netlify environment variables
| Name | What it is |
|---|---|
| `ADMIN_PASSWORD` | Password for /admin |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (for video uploads) |
| `CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name in Cloudinary |

Inventory is edited at **/admin**. VIN decoding uses the NHTSA vPIC API.
