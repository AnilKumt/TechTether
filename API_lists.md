# API LISTS.

## auth Routers
- POST /signup
- POST /login
- POST /logout

## progile Routers
- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

## connection request Routers
- POST /request/send/:status/:userId
    - POST /request/send/interested/:userid
    - POST /request/send/ignored/:userid
- POST /request/review/accepted/:requestid
- POST /request/review/rejected/:rejectid

## user Router
- GET /connections
- GET /requests received
- GET /feed