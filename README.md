<h1 align="center"> :memo: React TypeScript Form with Local API :floppy_disk: </h1>

## 🖥 Preview
<p align="center">
  <img src="xxx" width="700" height="auto">
</p>

## 📖 About
<p>A simple form built with React and TypeScript to collect user data (Name, Email, and CEP) and store it in a local JSON database. This project includes client-side validation, loading states, and integration with an external API to validate CEPs.</p>

---

## 🛠 Technologies used
- React
- TypeScript
- JSON Server (for local API)
- Axios
- SCSS
- React-Scripts
- HTML

---

## 🚀 How to execute the project

#### Clone the repository

```bash
git clone https://github.com/ecpieritz/react-typescript-form.git
```
#### Enter directory

```bash
cd react-typescript-form
```

#### Install dependencies

```bash
npm install
```

#### Run the JSON Server (for local database)
In one terminal, start the JSON Server:

```bash
npm run server
```

This will run the local API at http://localhost:5000, where all submitted data will be stored.

#### Run the React Application
In another terminal, run:

```bash
npm start
```

This will start the React development server. You can view the app at http://localhost:3000.

---

## 📊 View the submitted data
To see the data submitted through the form, open your browser and go to:

```bash
http://localhost:5000/cadastros
```

This will display all form submissions in JSON format.

---

<p align="right">Developed with :blue_heart: by Emilyn C. Pieritz</p> 