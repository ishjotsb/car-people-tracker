import { useState } from "react";
import "../style/home.css";
import Input from "./ui/Input";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addNewPerson(firstName: $firstName, lastName: $lastName) {
      firstName
      lastName
      id
    }
  }
`;

export default function AddPerson({ onPersonAdded }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function handleFirstName(value) {
    setFirstName(value);
  }

  function handleLastName(value) {
    setLastName(value);
  }

  function handleAddPerson() {
    if (firstName == "" || lastName == "") {
      alert("Please enter all details.");
      return;
    }

    client
      .mutate({
        mutation: ADD_PERSON,
        variables: {
          firstName: firstName,
          lastName: lastName,
        },
      })
      .then((result) => {
        console.log(result);
        if (onPersonAdded) {
          onPersonAdded(result.data.addNewPerson);
        }
        setFirstName("");
        setLastName("");
      });
  }

  return (
    <section>
      <div className="section-heading">
        <h2>
          <span>Add Person</span>
        </h2>
      </div>

      <div className="form-wrapper">
        <Input
          type="text"
          inputLabel="First Name"
          inputHandler={handleFirstName}
          value={firstName}
        />
        <Input
          type="text"
          inputLabel="Last Name"
          inputHandler={handleLastName}
          value={lastName}
        />
        {firstName == "" || lastName == "" ? (
          <button disabled onClick={handleAddPerson}>
            Add Person
          </button>
        ) : (
          <button onClick={handleAddPerson}>Add Person</button>
        )}
      </div>
    </section>
  );
}
