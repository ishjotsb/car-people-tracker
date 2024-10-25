const typeDefs = `#graphql

    type Person {
        id: String
        firstName: String,
        lastName: String
        cars: [Car]
    },
    type Car {
        id: String,
        year: Int,
        make: String,
        model: String,
        price: Float,
        personId: String
    }

    type Query {
        getAllPerson: [Person]
        getAllCars: [Car]
        cars: [Car]
        car(id: String): Car
        person(id: String): Person
    }

    type Mutation {
        addNewPerson(firstName: String!, lastName: String!): Person
        deletePerson(personId: String!): [Person]
        updatePerson(personId: String!, person: AddPersonType): [Person]
        addNewCar(car: AddCarType): Car
        deleteCar(carId: String!): [Car]
        updateCar(carId: String!, car: AddCarType): [Car]
    }

    input AddCarType {
        year: Int,
        make: String,
        model: String,
        price: Float,
        personId: String
    }

    input AddPersonType {
        firstName: String,
        lastName: String
    }

`

module.exports = typeDefs