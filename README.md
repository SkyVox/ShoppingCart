# Installation Tutorial

## Requirements

1.  Node LTS (version 22.11.0)
2.  yarn (version 1.22.22)

## Running the Project

Before we execute this API we should install the dependencies, by that you should execute the command below on the project's folder:

    $ yarn install

Now with all the dependencies installed, you should setup the `.env` file. Go to the project's folder and open the file called `.env.example`, you can change the port and the JWT secret as you want.
_Exemple of `.env.example` file_

    PORT  =  3000
    JWT_SECRET_TOKEN  =  'super#secret'

Change to the desired values and rename the file to `.env`.

After that we can start the application, for that you can execute the command below:

    $ yarn run start

_Note: You can also run in debug mode by pressing `F5` on VSCode._

With the application running you can browse to http://localhost:3000/docs then check the swagger documentation.

## Endpoints (API)

There are 5 endpoints available:

    POST http://localhost:3000/user/token
    dto: {
        "Name": "email@test.com",
        "Role": "COMMON" // Possible values: COMMON and VIP
    }

    This endpoint generates a JWT token with the given information.

---

    GET http://localhost:3000/cart

    This endpoint list all products added into user's cart.

---

    POST http://localhost:3000/cart/insert
    dto: {
        "ProductId":  "T_SHIRT", // Possible values: T_SHIRT, JEANS, DRESS
        "Name":  "Yellow T-Shirt"
    }

    In this endpoint you can add new products into your cart.

---

    DELETE http://localhost:3000/cart/remove
    dto: {
        "ProductId":  "T_SHIRT"
    }

    Remove 1x product from the cart.

---

    GET http://localhost:3000/cart/calculate-price

    Calculate the price for the current items on the user's cart.
    Note: This endpoint have all the price rules.
    1- Available Promotions:
        - Get 3 for the Price of 2
        - VIP Discount
    2- Rules:
    	- VIP always have the VIP Discount, the only exception is if promotion `Get 3 for the Price of 2` has a lower price.
    	- Get 3 for the Price of 2 Promotion is only available if there are 3 or more product on user's cart.
     
     The response follows the pattern below:
     {
         "cartTotalPrice": number; // Which is the price of all items that this user added on their cart, without any discounts.
         "finalPrice": number; // This is the final price that this user should pay, this is the property that includes the rules above.
     }

---

I also have created a collection on Postman, you can import by using the file below:
[Shopping Cart Postman Collection](https://drive.google.com/file/d/1oYLJdX9Uo0rcfo-DvvCBxJrjPqYSSdBc/view?usp=sharing)

## Running Test

To run the tests you should execute the following command:

    // The command below will execute all tests
    $ yarn test
    // The command below will print on console the coverage (it also generates an .html file to check the coverage on browser)
    $ yarn test:cov

# Architecture

  This project was made using `Node` and `NestJS` framework, with this combination we can easily build and deploy fast and scalable APIs. It also follows the `Repository Pattern`. Just for the challenge purpose only the Repository class has a mock 'storage', but in the future using this pattern it's easy to switch to another database or connection.
  
  To increase the readability and maintainability the project follows the NestJS modules structure, each module has their own responsabilities inclusing [controller, services and module].
  
  The API comes with an endpoint that you can create COMMON or VIP user. This endpoint generates and returns a JWT token with all the user information. After that, for each request you should add this token into the `Authorization` header so the API can read all the user data including the user role so it can determine wether this user is COMMON or VIP.

  As an API, we handle multiple data inputs, so we need to ensure that only the desired properties and values are passed to the API. So some pipelines were configured to accept only the specified properties and values. For example: the endpoint `/user/token` accepts only two properties Name and Role, and the role property is a enum that will only accept: "COMMON" or "VIP". With this, we ensure that only the necessary values are sent to the API.


##### Below we have the JWT token Diagram

![Generate JWT Token Diagram](https://github.com/user-attachments/assets/79c14476-025f-4cb7-914e-b836e2e3a501)

#### List of Technologies that were used in this Project:

1. Node Latest Version
2. NestJS
3. JWT (for the user authentication and role)
4. Jest (for tests)
5. helmet (for secutiry headers)

---

# Extras

Video Showcase:

https://github.com/user-attachments/assets/fe54aaa5-4e8c-478d-aa56-b0d540ce58c0

