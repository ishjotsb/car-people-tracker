import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import '../style/home.css'

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const PERSON_WITH_CARS = gql`
  query PersonWithCars($id: String) {
    person(id: $id) {
      firstName
      lastName
      cars {
        model
        make
        price
        year
        id
      }
    }
  }
`;

export default function Person() {
  const { id } = useParams();
  const [personData, setPersonData] = useState({});

  useEffect(() => {
    client
      .query({
        query: PERSON_WITH_CARS,
        variables: {
          id: id,
        },
      })
      .then((result) => {
        setPersonData(result.data.person);
      });
  }, []);

  function formatCurrency(price) {
    return price.toLocaleString();
  }

  return (
    <div className="person-details-container">
      <div id="back-btn">
        <Link to="/">Go Back Home</Link>
      </div>
      {personData && personData.cars && (
        <div className="person-container">
          <h2>
            {personData.firstName} {personData.lastName}
          </h2>
          <p>owns {personData.cars.length} car(s)</p>
          <ul>
            {personData.cars.map(car => <li key={car.id}><p>{car.year} {car.make} {car.model} valued at ${formatCurrency(car.price)}</p></li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
