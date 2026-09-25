# Agroverse deployment

## Local production check

```bash
python manage.py check --deploy
python manage.py collectstatic --no-input
gunicorn plantcare_project.wsgi:application
```

## Render

This repository includes `render.yaml`. Create a new Render Web Service from the
GitHub repository and choose **Blueprint** deployment. Add these environment variables in Render:

```text
SECRET_KEY=<long-random-value>
ALLOWED_HOSTS=<service-name>.onrender.com
CORS_ALLOWED_ORIGINS=https://<service-name>.onrender.com
CSRF_TRUSTED_ORIGINS=https://<service-name>.onrender.com
```

The diagnosis endpoint uses the bundled local tomato disease model. No Groq API
key is required.

Render provides an `onrender.com` URL at no cost. The free web service filesystem
is ephemeral, so uploaded images and SQLite data are not suitable for permanent
production storage. Set `DATABASE_URL` to a managed PostgreSQL database and use
object storage for uploaded media before relying on the service for real users.
