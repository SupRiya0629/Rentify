# Rentify
Rentify is an application that serve online rental system.
# Rentify

Rentify is a web application that allows users to register as either sellers or buyers. Sellers can list properties for rent, while buyers can browse and search for properties.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Frontend Interaction](#frontend-interaction)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- Separate user roles for sellers and buyers
- Sellers can add properties
- Buyers can view properties

## Installation

Follow these steps to set up the project on your local machine.

### Prerequisites

- Python 3.9+
- Django 4.2+
- MySQL

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/rentify.git
    cd rentify_backend
    ```

2. Create and activate a virtual environment:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Configure your database in `rentify_backend/settings.py`:
    ```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'rentify',
            'USER': 'root',
            'PASSWORD': 'mysql@2002',
            'HOST': 'localhost',
            'PORT': '3306',
        }
    }
    ```

5. Apply database migrations:
    ```sh
    python manage.py makemigrations
    python manage.py migrate
    ```

6. Create a superuser:
    ```sh
    python manage.py createsuperuser
    ```

7. Run the development server:
    ```sh
    python manage.py runserver
    ```

### Frontend Setup

1. Create an HTML file (e.g., `index.html`) in your project root with the provided content in the previous step.

2. Open the HTML file in your browser to access the frontend.

## Usage

### Registration

1. Open the registration form in your browser.
2. Fill in the required fields and click "Register".

### Login

1. Open the login form in your browser.
2. Enter your username and password and click "Login".

## API Endpoints

### User Registration

- **URL**: `/api/register/`
- **Method**: `POST`
- **Data Params**:
    - `first_name` (string)
    - `last_name` (string)
    - `email` (string)
    - `phone_number` (string)
    - `username` (string)
    - `password` (string)
    - `is_seller` (boolean)
    - `is_buyer` (boolean)

### User Login

- **URL**: `/api/login/`
- **Method**: `POST`
- **Data Params**:
    - `username` (string)
    - `password` (string)

### Properties

- **URL**: `/api/properties/`
- **Method**: `GET` / `POST`
- **Data Params** (for POST):
    - `place` (string)
    - `area` (integer)
    - `bedrooms` (integer)
    - `bathrooms` (integer)
    - `hospitals_nearby` (boolean)
    - `colleges_nearby` (boolean)

## Frontend Interaction

The frontend consists of a simple HTML page with forms for registration and login. JavaScript is used to handle form submissions and communicate with the Django backend using the Fetch API.

## Contributing

Contributions are welcome! Please create a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
