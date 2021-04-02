# IDOL Backend

The backend is built with TypeScript and Express, and it is deployed to Netlify functions in the
same instance as idol frontend.

## Backend Layers

The backend has a layered design and can be divided into three layers:

- Gateway Layer
  This layer exists mostly in [`api.ts`](./src/api.ts).

  It uses express to parse request, handle basic authentication, and process handler result.

  It gives the business logic layer parsed request information and authenticated user object, and
  expect the business logic layer to do work based on these information and return some information
  to be sent back to frontend. The business logic layer is also allowed to throw some pre-defined
  [errors](./src/errors.ts), which will be handled by this layer.

- Business Logic Layer
  This layer exists in files like `xxxAPI.ts`.

  The business logic layer is where all the interesting logic happens. This layer may perform some
  more granular permission checks, perform some data consistency checks, do some manipulation of the
  request data and do some database operations.

  However, this layer doesn't do raw database operations directly. This is delegated to database
  layer.

- Database Layer

  This layer is just a wrapper around the firestore. It provides an convenient interface more
  specific to IDOL logic.

Example: An endpoint to update member information.

1. In the gateway layer, we
   [authenticated the user](https://github.com/cornell-dti/idol/blob/907a3f950cd24023b2b6cbb663f04146822a00ed/backend/src/api.ts#L79-L100) and
   [parse the request body](https://github.com/cornell-dti/idol/blob/907a3f950cd24023b2b6cbb663f04146822a00ed/backend/src/api.ts#L171-L173). Then we call the business
   logic layer function [`updateMember`](https://github.com/cornell-dti/idol/blob/907a3f950cd24023b2b6cbb663f04146822a00ed/backend/src/api.ts#L171-L173).

2. In business logic layer, we check the user permission in two more places: [(1)](https://github.com/cornell-dti/idol/blob/907a3f950cd24023b2b6cbb663f04146822a00ed/backend/src/memberAPI.ts#L28-L34), [(2)](https://github.com/cornell-dti/idol/blob/907a3f950cd24023b2b6cbb663f04146822a00ed/backend/src/memberAPI.ts#L38-L47).
   We also perform some data format check [here](https://github.com/cornell-dti/idol/blob/907a3f950cd24023b2b6cbb663f04146822a00ed/backend/src/memberAPI.ts#L35-L37).
   If nothing is wrong, we [call the database layer function](https://github.com/cornell-dti/idol/blob/907a3f950cd24023b2b6cbb663f04146822a00ed/backend/src/memberAPI.ts#L48) to write the data.

3. In the database logic layer, we perform some raw database operation. The code here is usually
   quite simple and not directly related to any business logic. [Example](https://github.com/cornell-dti/idol/blob/907a3f950cd24023b2b6cbb663f04146822a00ed/backend/src/dao/MembersDao.ts#L26-L32).
