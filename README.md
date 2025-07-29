# PersonalMindMap Frontend

This is the **frontend** for the PersonalMindMap project, built with [Next.js](https://nextjs.org) and React.

## Getting Started

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Configure environment variables:**

    Create a `.env` file in the `frontend` directory. Example:

    ```
    NEXT_PUBLIC_API_URL_LOCAL=http://localhost:3001/api
    NEXT_PUBLIC_API_URL_DEV=https://dev.personalmindmap.com/api
    NEXT_PUBLIC_API_URL_PROD=https://www.personalmindmap.com/api
    ```

    The app will automatically select the correct backend API URL based on where it is running:
    - **Local:** If running at `localhost:3000`, it uses `NEXT_PUBLIC_API_URL_LOCAL`
    - **Dev Website:** If running at `www.dev.personalmindmap.com`, it uses `NEXT_PUBLIC_API_URL_DEV`
    - **Production Website:** If running at `www.personalmindmap.com`, it uses `NEXT_PUBLIC_API_URL_PROD`

3. **Run the development server locally:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to use the app locally.

4. **Build for production:**

    Before deploying to production or a remote server, build the optimized production version:

    ```bash
    npm run build
    ```

    Then start the production server with:

    ```bash
    npm start
    ```

5. **Deploying to Dev or Production:**

    - For the dev website, deploy to `dev.personalmindmap.com` and ensure your `.env` contains the correct `NEXT_PUBLIC_API_URL_DEV`.
    - For production, deploy to `www.personalmindmap.com` and ensure your `.env` contains the correct `NEXT_PUBLIC_API_URL_PROD`.

## Project Structure

- Main app code: `src/app/`
- Mind map page: `src/app/mindmap/page.js`
- Login page: `src/app/login/page.js`
- Signup page: `src/app/signup/page.js`
- Environment variables: `.env`

## Notes

- The frontend automatically chooses the backend API URL based on the current hostname.
- The app uses [Next.js App Router](https://nextjs.org/docs/app) and React 19.
