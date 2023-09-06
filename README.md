# Project Title

Web application, accessible by any user, that allows an educator to conduct interactive quizzes. This methodology will serve the educator as a guide to reinforce knowledge in students while being able to perform an analysis to find weaknesses in student learning.

## Demo

The production environment is: [PlusLearn](https://pluslearn.onrender.com/)

## Run Locally

Clone the project

```bash
  git clone https://github.com/PlushyZeus35/PlusLearn.git
```

Go to the project directory

```bash
  cd PlusLearn
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

To start the server in a development mode

```bash
  npm run nodemon
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PLUSLEARNDB_HOST` Hostname or IP address of the machine hosting the MariaDB database.

`PLUSLEARNDB_DATABASE` Database name used in this project. Must be created in a MariaDB database.

`PLUSLEARNDB_USER` Username of the MariaDB database.

`PLUSLEARNDB_PASSWORD` Password of the user of the MariaDB database.

`EMAIL_SENDER` Email direction used to send communications to users.

`EMAIL_PASSWORD` Pasword of email used to send communications to users.

`EMAIL_RECEIVER` Email directions used to receive error communications of the platform.

## Contributing

Contributions are always welcome!

This repository don't have `contributing.md` at this moment.
To contribute to the project follow the next steps:

- Create a feature branch from the dev branch

```bash
  git checkout dev
  git pull
  git checkout -b "new-branch-name"
```

- Develop the new features in the new branch
- Create a PR to the dev branch with information of the pull request and some screenshots if are necessary.
- The code owner will review the changes and will deploy it in next releases

## Authors

- [@PlushyZeus35](https://www.github.com/PlushyZeus35)

## Powered by

This project was created for a final thesis of the degree in computer engineering of university of Salamanca.
![Logo](https://web.gcompostela.org/wp-content/uploads/2019/02/University-of-Salamanca-1024x334.png)
