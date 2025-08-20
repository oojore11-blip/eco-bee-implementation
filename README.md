# eco-bee

# Instructions for windows

1. Install python libraries

- cd backend; pip install -r .\requirements.txt; py -3 .\app.py

2. Initialize npm

- cd frontend; npm install; npm run dev

# Note:

- Backend runs on localhost:8000
- Frontend runs on localhost:3000
- All environment variables must start with `NEXT_PUBLIC_` to be accessible in the frontend
- Never commit .env.local files to git

# CAUTION

.next frequently gets corrupted run this in the frontend directory:

- Remove-Item -Recurse -Force .next
