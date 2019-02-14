# Twatter Authentication Documentation

In the backend, we use JSON Web tokens along side passport.js to authenticate service requests.

## JSON Web Token

> JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
>
> JWT.IO allows you to decode, verify and generate JWT.

## Passport.js

> Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more.

More information and documentation for passport.js can be found [here](http://www.passportjs.org/ 'Passportjs').

## In Angular

| auth-interceptor.ts -> Added to app module so now every HTTP requests pass through here                                 |
| ----------------------------------------------------------------------------------------------------------------------- |
| The goal of this class is to intercept all outgoing http calls to the server and modify the headers to contain the JWT. |

| auth.guard.ts -> Should be used in app-routing module                                                 |
| ----------------------------------------------------------------------------------------------------- |
| The goal of this class is to protect the frontend routes from people that are not signed in.          |
| For example, people should not be allowed to access some users information unless they are logged in. |

To use the AuthGuard, modify app-routing.module.ts routes.

```
const routes: Routes = [
  { path: "", component: SomeComponent }, // no Guard
  { path: "route", component: AnotherComponent, canActivate: [AuthGuard] } // now user cannot acces /route unless he is logged in
]
```

**I added comments in the auth.service.ts file to explain how the functions can be used in the app.** <br />
