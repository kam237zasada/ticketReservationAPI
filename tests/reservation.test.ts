import { arePlacesFree, checkSeats, computePrice } from "../src/controllers/reservations/addReservation"
import { SeatInstance } from "../src/DBModels/Seat";
import { SectorPrices } from "../src/models/common/SectorPrices";

describe("check that seats are valid in reservation", () => {
    describe("happy", () => {

        test("should be true for valid seats", () => {

            const seats: SeatInstance[] = [
                {
                    id: 1,
                    hallId: 1,
                    place: 1,
                    row: 1,
                    sector: "A"
                },
                {
                    id: 2,
                    hallId: 1,
                    place: 2,
                    row: 1,
                    sector: "A"
                },
                {
                    id: 3,
                    hallId: 1,
                    place: 3,
                    row: 1,
                    sector: "A"
                },{
                    id: 4,
                    hallId: 1,
                    place: 4,
                    row: 1,
                    sector: "A"
                }
            ]
            const response = checkSeats(seats);

            expect(response).toBe(true);
            
        })
    })

    describe("unhappy", () => {
        test("should throw error when seats are not around", () => {
            const seats: SeatInstance[] = [
                {
                    id: 1,
                    hallId: 1,
                    place: 1,
                    row: 1,
                    sector: "A"
                },
                {
                    id: 2,
                    hallId: 1,
                    place: 3,
                    row: 1,
                    sector: "A"
                }
            ]

            expect(() => checkSeats(seats)).toThrowError('All seats must be around each other');
        })
        test("should throw error when trying to reserve the same seat", () => {
            const seats: SeatInstance[] = [
                {
                    id: 1,
                    hallId: 1,
                    place: 1,
                    row: 1,
                    sector: "A"
                },
                {
                    id: 1,
                    hallId: 1,
                    place: 1,
                    row: 1,
                    sector: "A"
                }
            ]

            expect(() => checkSeats(seats)).toThrowError('You are trying to reserve exactly the same seat more than once');
        })
    })
})

describe("compute price", () => {
    test("should correct compute price for reservations", () => {
        const seats: SeatInstance[] = [
            {
                id: 1,
                hallId: 1,
                place: 1,
                row: 1,
                sector: "A"
            },
            {
                id: 1,
                hallId: 1,
                place: 1,
                row: 1,
                sector: "B"
            }
        ]

        const sectorPrices: SectorPrices = {
            A: 100,
            B: 80,
            C: 60,
            D: 50
        }

        const price = computePrice(seats, sectorPrices);

        expect(price).toBe(180);

    })
})

describe("checks that seats are reserveable", () => {
    describe("happy", () => {
        test("should return true for free places", () => {
        const seats: SeatInstance[] = [
            {
                id: 3,
                hallId: 1,
                place: 3,
                row: 1,
                sector: "B"
            },
            {
                id: 4,
                hallId: 1,
                place: 4,
                row: 1,
                sector: "B"
            }
        ]
        
        const reservedSeats: SeatInstance[] = [
            {
                id: 1,
                hallId: 1,
                place: 1,
                row: 1,
                sector: "A"
            },
            {
                id: 1,
                hallId: 1,
                place: 1,
                row: 1,
                sector: "B"
            }
        ]

        const response = arePlacesFree(reservedSeats, seats);

        expect(response).toBe(true);
    })
})

    describe("unhappy", () => {
        test("should return false when places are reserved", () => {
        const seats: SeatInstance[] = [
            {
                id: 3,
                hallId: 1,
                place: 3,
                row: 1,
                sector: "B"
            },
            {
                id: 4,
                hallId: 1,
                place: 4,
                row: 1,
                sector: "B"
            }
        ]
        
        const reservedSeats: SeatInstance[] = [
            {
                id: 3,
                hallId: 1,
                place: 2,
                row: 1,
                sector: "A"
            },
            {
                id: 2,
                hallId: 1,
                place: 2,
                row: 1,
                sector: "B"
            }
        ]

        const response = arePlacesFree(reservedSeats, seats);

        expect(response).toBe(false);
    })
})
})