import { useState, useEffect } from "react";
import "../style/home.css";
import Input from "./ui/Input";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const ADD_CAR = gql`
  mutation AddCar($car: AddCarType) {
    addNewCar(car: $car) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export default function AddCar({ onCarAdded, newPeopleList }) {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [peopleList, setPeopleList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");

  useEffect(() => {
    client
      .query({
        query: gql`
          query GetAllPeople {
            getAllPerson {
              id
              firstName
              lastName
            }
          }
        `,
      })
      .then((result) => {
        setPeopleList(result.data.getAllPerson);
      });
  }, []);

  function handleYear(value) {
    setYear(value);
  }

  function handleMake(value) {
    setMake(value);
  }

  function handleModel(value) {
    setModel(value);
  }

  function handlePrice(value) {
    setPrice(value);
  }

  function handlePersonChange(event) {
    setSelectedPerson(event.target.value);
  }

  function handleAddCar() {
    if (
      year == "" ||
      make == "" ||
      model == "" ||
      price == "" ||
      selectedPerson == ""
    ) {
      alert("Please enter all details.");
      return;
    }
    client
      .mutate({
        mutation: ADD_CAR,
        variables: {
          car: {
            year: Number(year),
            make: make,
            model: model,
            price: parseFloat(price),
            personId: selectedPerson,
          },
        },
      })
      .then((result) => {
        console.log(result);
        if (onCarAdded) {
          onCarAdded(result.data.addNewCar);
        }
        // Clear the form
        setYear("");
        setMake("");
        setModel("");
        setPrice("");
        setSelectedPerson("");
      });
  }

  return (
    <section>
      <div className="section-heading">
        <h2>
          <span>Add Car</span>
        </h2>
      </div>

      <div className="form-wrapper">
        <Input
          type="Number"
          inputLabel="Year"
          inputHandler={handleYear}
          value={year}
        />
        <Input
          type="text"
          inputLabel="Make"
          inputHandler={handleMake}
          value={make}
        />
        <Input
          type="text"
          inputLabel="Model"
          inputHandler={handleModel}
          value={model}
        />
        <Input
          type="text"
          inputLabel="Price"
          inputHandler={handlePrice}
          value={price}
        />

        <div className="input-container">
          <label htmlFor="person-select">Person: </label>
          <select
            id="person-select"
            value={selectedPerson}
            onChange={handlePersonChange}
          >
            <option value="">Select a person</option>
            {newPeopleList &&
              newPeopleList.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.firstName} {person.lastName}
                </option>
              ))}
          </select>
        </div>

        {year == "" ||
        make == "" ||
        model == "" ||
        price == "" ||
        selectedPerson == "" ? (
          <button disabled onClick={handleAddCar}>
            Add Car
          </button>
        ) : (
          <button onClick={handleAddCar}>Add Car</button>
        )}
      </div>
    </section>
  );
}
