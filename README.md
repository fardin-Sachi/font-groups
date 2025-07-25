# Font Groups

Font Groups is a full-stack application that allows users to upload `.ttf` fonts, group them, and manage font collections with ease. Built with a modern stack: **Node.js**, **MongoDB**, **React**, **Vite** and **Tailwind CSS**.

## Features

- Upload and list `.ttf` fonts
- Group fonts together with a minimum of two per group
- Edit and delete font groups
- Automatically delete a group if it has fewer than 2 fonts after a font is removed

---

## Project Structure

font-groups/
├── backend/ # Node.js + MongoDB backend
├── frontend/ # React + Vite + Tailwind frontend
├── package.json # Root file with unified dev/build/start scripts

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/fardin-Sachi/font-groups.git
cd font-groups
```

### 2. Install Dependencies

```bash
npm run install-all
```

This installs dependencies for both the backend and frontend.

### 3. Environment Variables

Create a .env file inside the backend/ directory:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/font-groups?retryWrites=true&w=majority
PORT=8000
MONGODB_COLLECTION=font-groups

Replace <username> and <password> with your actual MongoDB Atlas credentials.

## Scripts

### Development Mode

```bash
npm run dev
```

Starts both backend (via Nodemon) and frontend (via Vite) concurrently.

### Production Build

```bash
npm run build
```

Builds the frontend using Vite.

### Production Start

```bash
npm run start
```

Starts the backend (node server.js) and serves the frontend using vite preview.

## Technologies Used

- Frontend: React 19, Tailwind CSS, Vite

- State Management: Zustand

- Backend: Node.js, MongoDB, Mongoose, Busboy/Formidable for file uploads

- Monorepo Tooling: Concurrently

## License

This project is licensed under the MIT License.