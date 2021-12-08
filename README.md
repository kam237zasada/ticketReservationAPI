# ticketReservationAPI

### How to start

1. In terminal you have to check, that you have installed node and npm using commands:

`node -v`

Should appear message with node version, for example:

`v14.15.4`

oraz

`npm -v`

Should appear message with npm version, for example:

`6.14.10`

If an error occured, you have to download this tools from here <a href=https://nodejs.org/en/download/>KLIK</a>

2. In tour terminal: `git clone https://github.com/kam237zasada/ticketReservationAPI.git`
3. You ahve to go to the root folder of project: `cd ticketReservationAPI`
4. You have to install all dependencies: `npm install`
5. To run project in developer mode you have to run `npm run dev`, but when you want to just run it, type: `npm run start`
6. Application will start on localhost:8080, which would be confirmed with message:

`Server started at http://localhost:8080`

7. For run tests just type: `npm run test`

### API

## Method: POST

### <b>api/halls</b>

Adding new hall to our system. Example body in that request:

`{ "name": "Hall 1", "seats": [{ "row": 1, "place": 1, "sector": "A"}, { "row": 1, "place": 2, "sector": "B"}, { "row": 1, "place": 3, "sector": "C"}, { "row": 1, "place": 4, "sector": "D"}] }`

Please note that only "A", "B", "C" or "D" is valid for field "sector".

Response example:

`{
    "message": "Hall Hall 1 created",
    "hall": {
        "id": 1,
        "name": "Hall 1",
        "availablePlaces": 4
    }
}`

## Method: POST

### <b>api/events</b>

Adding new event to our system. Example body in that request:

`{
	"name": "Jumanji",
	"startDate": "2022-01-10T20:00:00.000Z",
	"hallId": 1,
	"sectorAPrice": 30.50,
	"sectorBPrice": 25.1,
	"sectorCPrice": 20,
	"sectorDPrice": 18
}`

Response example:

`{
    "message": "Event Jumanji created",
    "event": {
        "id": 1,
        "name": "Jumanji",
        "startDate": "2022-01-10T20:00:00.000Z",
        "hallId": 1,
        "sectorAPrice": 30.5,
        "sectorBPrice": 25.1,
        "sectorCPrice": 20,
        "sectorDPrice": 18,
        "soldTickets": 0
    }
}`

## Method: POST

### <b>api/reservations</b>

Adding new reservation to our system. Example body in that request:

`{
	"eventId": 1,
	"seats": [
			1,2
		],
	"email": "example@example.com"
}`

Field "seats" means IDs of seats in our database.

This should return if success:

`{
    "message": "Your reservation added. Now you have 15 minutes to pay it.",
    "reservation": {
        "id": 1,
        "eventId": 1,
        "timeCreated": "2021-12-08T20:08:06.939Z",
        "validTo": "2021-12-08T20:23:06.939Z",
        "status": "UNCONFIRMED",
        "totalPrice": 35.6,
        "email": "example@example.com"
    }
}`

Or message error when something went wrong with reservation, for example when seats are reserved:

`{
    "message": "Some of places you selected are reserved. Please choose other places"
}`

## Method: POST

### <b>api/payments</b>

Adding new payment for single reservation. Example body:

`{
	"reservationId": 1
}`

This should return if success:

`{
    "message": "Your reservation is now confirmed. You can just wait until the event starts",
    "reservation": {
        "id": 1,
        "eventId": 1,
        "timeCreated": "2021-12-08T20:08:06.939Z",
        "validTo": "2021-12-08T20:23:06.939Z",
        "status": "CONFIRMED",
        "totalPrice": 35.6,
        "email": "example@example.com",
        "Seats": [
            {
                "id": 1,
                "row": 1,
                "place": 1,
                "sector": "A",
                "hallId": 1,
                "SeatsReservations": {
                    "price": 30.5,
                    "SeatId": 1,
                    "ReservationId": 1
                }
            },
            {
                "id": 2,
                "row": 1,
                "place": 2,
                "sector": "B",
                "hallId": 1,
                "SeatsReservations": {
                    "price": 25.1,
                    "SeatId": 2,
                    "ReservationId": 1
                }
            }
        ]
    },
    "tickets": [
        {
            "id": 1,
            "price": 30.5,
            "email": "example@example.com",
            "seatId": 1,
            "eventId": 1
        },
        {
            "id": 2,
            "price": 25.1,
            "email": "example@example.com",
            "seatId": 2,
            "eventId": 1
        }
    ]
}`

Or message error when something goes wrong, for example when reservation timed out:

`{
    "message": "Sorry, but this reservations is timed out. Please create a new one."
}`

## Method: GET

### <b>api/reservations?eventId=1&status=UNCONFIRMED$valid=true&offset=0&limit=10</b>

Fetching reservations from our database. Params are optional. Without them, API return all records, example of response:

`{
    "id": 1,
    "timeCreated": "2021-12-08T18:08:36.000Z",
    "status": "CONFIRMED",
    "validTo": "2021-12-08T18:23:36.000Z",
    "totalPrice": 300,
    "eventId": 1,
    "Event": {
        "id": 1,
        "soldTickets": 2,
        "name": "Jumanji",
        "startDate": "2022-01-10T20:00:00.000Z",
        "hallId": 1,
        "sectorAPrice": 30.50,
        "sectorBPrice": 25.1,
        "sectorCPrice": 20,
        "sectorDPrice": 18
    },
    "Seats": [
        {
            "id": 1,
            "row": 1,
            "place": 1,
            "sector": "A",
            "hallId": 1,
            "SeatsReservations": {
                "price": 30.5,
                "SeatId": 1,
                "ReservationId": 1
            }
        },
        {
            "id": 2,
            "row": 1,
            "place": 2,
            "sector": "B",
            "hallId": 1,
            "SeatsReservations": {
                "price": 25.1,
                "SeatId": 2,
                "ReservationId": 1
            }
        }
    ]
}`

When there is no result for request, API will response with:

`[]`

## Method: GET

### <b>api/reservations/1</b>

Fetching single reservation from our database. Example response:

`{
    "id": 1,
    "timeCreated": "2021-12-08T18:08:36.000Z",
    "status": "CONFIRMED",
    "validTo": "2021-12-08T18:23:36.000Z",
    "totalPrice": 300,
    "eventId": 1,
    "Event": {
        "id": 1,
        "soldTickets": 2,
        "name": "Jumanji",
        "startDate": "2022-01-10T20:00:00.000Z",
        "hallId": 1,
        "sectorAPrice": 30.50,
        "sectorBPrice": 25.1,
        "sectorCPrice": 20,
        "sectorDPrice": 18
    },
    "Seats": [
        {
            "id": 1,
            "row": 1,
            "place": 1,
            "sector": "A",
            "hallId": 1,
            "SeatsReservations": {
                "price": 30.5,
                "SeatId": 1,
                "ReservationId": 1
            }
        },
        {
            "id": 2,
            "row": 1,
            "place": 2,
            "sector": "B",
            "hallId": 1,
            "SeatsReservations": {
                "price": 25.1,
                "SeatId": 2,
                "ReservationId": 1
            }
        }
    ]
}`

When there is no reservation, API will response with:

`{
    "message": "There is no reservation with given id"
}`


 ////////////////////

## Others:

Application is dropping all database records while start. It is for simplify and for testing.





