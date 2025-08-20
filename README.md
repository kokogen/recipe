# Recipeum

Web-application for managing recipes.

## Deployment

To deploy the application, you will need to have Docker and Docker Compose installed.

1. Clone the repository.
2. Run the following command in the root of the repository:

```bash
docker-compose up --build -d
```

The application will be available at `http://localhost:3000`.

## API Documentation

The API documentation is available at `http://localhost:8000/docs` when the application is running.

Here is a snapshot of the API documentation:

```html
<!DOCTYPE html>
<html>
<head>
<link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
<link rel="shortcut icon" href="https://fastapi.tiangolo.com/img/favicon.png">
<title>FastAPI - Swagger UI</title>
</head>
<body>
<div id="swagger-ui">
</div>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<!-- `SwaggerUIBundle` is now available on the page -->
<script>
const ui = SwaggerUIBundle({
    url: '/openapi.json',
"dom_id": "#swagger-ui",
"layout": "BaseLayout",
"deepLinking": true,
"showExtensions": true,
"showCommonExtensions": true,
oauth2RedirectUrl: window.location.origin + '/docs/oauth2-redirect',
    presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
})
</script>
</body>
</html>
```
