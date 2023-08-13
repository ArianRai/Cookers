# Project: Carlos & Arian

## Description

Development of a website where you can find and save your favorites food recipes, see other's favorites and if you register as chef you can create your own recipes and share with others

## API

We will be using Edamam's Recipe Search API - https://developer.edamam.com/edamam-recipe-api

## Edpoints table


| HTTP Method | URI Path                                        | Description                 | JSON |
| ----------- | ----------------------------------------------- | --------------------------- | :--: |
| GET         | `/`                                             | index                       |      |
| GET         | `/auth/signup `                                 | sign up form render         |      |
| POST        | `/auth/signup `                                 | sign up form handler        |      |
| GET         | `/auth/login`                                   | log in form render          |      |
| POST        | `/auth/login                                    | log in form handler         |      |
| POST        | `/auth/logout`                                  | log out user                |      |
| GET         | `/user/{user_id}/details`                       | user account                |      |
| GET         | `/user/{user_id}/edit`                          | user account form render    |      |
| POST        | `/user/{user_id}/edit`                          | user account form handler   |      |
| POST        | `/user/{user_id}/delete`                        | delete user account         |      |
| GET         | `/user/list`                                    | List of users               |      |
| GET         | `/recipe/list`                                  | List of recipes             |  ✅  |
| GET         | `/recipe/{recipe_id}/details`                   | Recipe details              |  ✅  |
| GET         | `/recipe/create`                                | New recipe form render      |      |
| POST        | `/recipe/create`                                | New recipe form handler     |      |
| GET         | `/recipe/{recipe_id}/edit`                      | Recipe edition form render  |      |
| POST        | `/recipe/{recipe_id}/edit`                      | Recipe edition form handler |      |
| POST        | `/recipe/{recipe_id}/delete`                    | Recipe delete               |      |
| GET         | `/recipe/{recipe_id}/review/create`             | New review form render      |      |
| POST        | `/recipe/{recipe_id}/review/create`             | New review form handler     |      |
| POST        | `/recipe/{recipe_id}/review/{review_id}/delete` | Delete review               |      |
