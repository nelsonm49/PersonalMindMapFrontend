# PersonalMindMap Frontend

This is the **frontend** for the PersonalMindMap project, built with [Next.js](https://nextjs.org) and React.

## Getting Started

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Configure environment variables:**

    Create a `.env` file in the `frontend` directory. Required Variables:

    ```
    NEXT_PUBLIC_API_URL_LOCAL
    NEXT_PUBLIC_API_URL_DEV
    NEXT_PUBLIC_API_URL_PROD
    ```

    The app will automatically select the correct backend API URL based on where it is running:
    - **Local:** If running at `localhost:3000`, it uses `NEXT_PUBLIC_API_URL_LOCAL`
    - **Dev Website:** If running at `www.dev.personalmindmap.com`, it uses `NEXT_PUBLIC_API_URL_DEV`
    - **Production Website:** If running at `www.personalmindmap.com`, it uses `NEXT_PUBLIC_API_URL_PROD`

3. **Run the development web application locally:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to use the app locally.

4. **Build for static export (for S3/CloudFront):**

    Before deploying to production or a remote server, build the optimized static version:

    ```bash
    npm run build
    ```

    This will generate an `out` directory containing your static site.  

5. **Deploying to Dev or Production:**

    - For S3/CloudFront deployment, upload the contents of the `out` directory to a new S3 bucket, aggregating the version number from the most recent S3 bucket.
    - Once files are uploaded in S3, manually remove .html extensions from each landing page (`index.html`, `signup.html`, `mindmap.html`) except for `index.html`.
    - In CloudFront Distributions, update the Origin to use the new S3 bucket.

## Project Structure

- Main app code: `src/app/`
- Login page: `src/app/login/page.js`
- Signup page: `src/app/signup/page.js`
- Mind map page: `src/app/mindmap/page.js`
- Environment variables: `.env`