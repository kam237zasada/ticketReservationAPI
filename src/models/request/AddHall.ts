interface Seat {
    row: number,
    place: number,
    sector: "A" | "B" | "C" | "D"
}

export interface AddHall {
    name: string,
    seats: Seat[],
    availablePlaces: number
}