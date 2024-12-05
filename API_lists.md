# API LISTS.

## auth Routers
- POST /signup ✅
- POST /login ✅
- POST /logout ✅

## profile Routers
- PATCH /profile/edit ✅
- GET /profile/view ✅
- PATCH /profile/changePassword ✅

## connection request Routers
- POST /request/send/:status/:userId ✅
    - POST /request/send/interested/:userid
    - POST /request/send/ignored/:userid
- POST /request/review/:status/:requestid ✅
    - POST /request/review/accepted/:requestid
    - POST /request/review/rejected/:requestid

## user Router
- GET /myConnections ✅
- GET /requests/received ✅
- GET /user/feed ✅