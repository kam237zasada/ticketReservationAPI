const request = require("supertest");
import app from "../src/index";
import db from "../src/DBModels/index";


let hallIdForTest: number;
let eventIdForTest: number;
let reservationIdForTest: number;


describe("posting data to database", () => {

    describe("happy", () => {

        beforeAll(async () => {
            await db.sequelize.sync({force: true})
        })

        test("POST /halls", async () => {
            
            const response = await request(app).post("/api/halls").send({
                name: "Sala",
                seats: [
                    {
                        place: 1,
                        row: 1,
                        sector: "A"
                    },
                    {
                        place: 2,
                        row: 1,
                        sector: "A"
                    },
                    {
                        place: 3,
                        row: 1,
                        sector: "A"
                    },
                    {
                        place: 4,
                        row: 1,
                        sector: "A"
                    }
                ]
            })
            hallIdForTest = response.body.hall.id;
            expect(response.statusCode).toBe(200)
        })

        test("POST /events", async () => {
            const now = new Date();
        const startDate = new Date(now.getTime() + 200 * 60000);
            const response = await request(app).post("/api/events").send({
                name: "Jumanji",
                hallId: hallIdForTest,
                startDate: startDate,
                sectorAPrice: 120,
                sectorBPrice: 100,
                sectorCPrice: 80,
                sectorDPrice: 60
            })
            eventIdForTest = response.body.event.id;
            expect(response.statusCode).toBe(200)

        })

        test("POST /reservations", async() => {
            const response = await request(app).post("/api/reservations").send({
                eventId: eventIdForTest,
                seats: [1, 2],
                email: "example@example.com"
            })
            reservationIdForTest = response.body.reservation.id
            expect(response.statusCode).toBe(200);

        })

        test("POST /payments", async() => {
            const response = await request(app).post("/api/payments").send({
                reservationId: reservationIdForTest,
            })

            expect(response.statusCode).toBe(200);

        })
    })

    describe("unhappy", () => {
        test("/halls should respond 400 when name is not given", async () => {
            const response = await request(app).post("/api/halls").send({
                seats: [
                    {
                        place: 1,
                        row: 1,
                        sector: "A"
                    },
                    {
                        place: 2,
                        row: 1,
                        sector: "A"
                    }
                ]
            })
            expect(response.statusCode).toBe(400);
        })

        test("/halls should respond 400 when seats are not valid", async () => {
            const response = await request(app).post("/api/halls").send({
                name: "Sala",
                seats: [
                    {
                        place: 1,
                        row: 1
                    },
                    {
                        place: 2,
                        row: 1,
                        sector: "A"
                    }
                ]
            })
            expect(response.statusCode).toBe(400);
        })

        test("/halls should respond 400 when seat sector is not valid string", async () => {
            const response = await request(app).post("/api/halls").send({
                name: "Sala",
                seats: [
                    {
                        place: 1,
                        row: 1,
                        sector: "R"
                    },
                    {
                        place: 2,
                        row: 1,
                        sector: "A"
                    }
                ]
            })
            expect(response.statusCode).toBe(400);
        })

        test("/events should respond 400 when request is not valid", async () => {
            const response = await request(app).post("/api/events").send({
                hallId: hallIdForTest,
                startDate: "2021-12-12 15:00",
                sectorAPrice: 120,
                sectorBPrice: 100,
                sectorCPrice: 80,
                sectorDPrice: 60
            })
            expect(response.statusCode).toBe(400);
        })

        test("/reservations should respond 400 when request is not valid - no seats", async () => {
            const response = await request(app).post("/api/reservations").send({
                eventID: 1,
                seats: [1, 2],
                email: "example@example.com"
            })
            expect(response.statusCode).toBe(400);
            expect(response.text).toBe('"eventId" is required');
        })

        test("/reservations should respond 400 when number of seats is not even", async () => {
            const response = await request(app).post("/api/reservations").send({
                eventId: 1,
                seats: [1, 2, 3],
                email: "example@example.com"
            })

            expect(response.statusCode).toBe(400);
        })
    })
})

