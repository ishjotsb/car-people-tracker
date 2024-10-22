import { useParams } from "react-router-dom";

export default function Person() {
  const { id } = useParams();

  return <div>{id}</div>;
}
