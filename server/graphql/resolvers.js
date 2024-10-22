let {people, cars} = require('../peopleCarsScheme');

const resolvers = {
    Query: {
        person: (parent, args) => {
            return people.find(person => person.id == args.id)
        },
        getAllPerson: () => {
            return people
        },
        getAllCars: () => {
            return cars;
        }
    },
    Person: {
        cars(parent) {
            return cars.filter(car => car.personId == parent.id)
        }
    },
    Mutation: {
        addNewPerson: (parent, args) => {
            const newPersonObj = {
                id: (people.length + 1).toString(),
                firstName: args.firstName,
                lastName: args.lastName,
            }
            people.push(newPersonObj);
            return newPersonObj
        },
        deletePerson: (parent, args) => {
            if(!args.personId) {
                throw new Error("Person ID is required");
            }
            people = people.filter(person => person.id !== args.personId);
            return people;
        },
        updatePerson: (parent, args) => {
            if(!args.personId) {
                throw new Error("Person ID is required");
            }
            const personToBeUpdated = people.find(person => person.id === args.personId);
            const indexToBeUpdated = people.indexOf(personToBeUpdated);
            let updatedPerson = {
                ...args.person,
                id: args.personId
            }
            people[indexToBeUpdated] = updatedPerson;
            return people
        },
        addNewCar: (parent, args) => {
            const newCarObj = {
                id: (cars.length + 1).toString(),
                ...args.car
            }
            cars.push(newCarObj)
            return newCarObj
        },
        deleteCar: (parent, args) => {
            if(!args.carId) {
                throw new Error("Car ID is required");
            }
            cars = cars.filter(car => car.id !== args.carId);
            return cars;
        },
        updateCar: (parent, args) => {
            if(!args.carId) {
                throw new Error("Car ID is required");
            }
            const carToBeUpdated = cars.find(car => car.id === args.carId);
            const indexToBeUpdated = cars.indexOf(carToBeUpdated);
            const updatedCar = {
                id: args.carId,
                ...args.car
            }
            cars[indexToBeUpdated] = updatedCar
            return cars
        }
    }
}

module.exports = resolvers;