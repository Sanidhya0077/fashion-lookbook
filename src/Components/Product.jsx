import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product Detail</h1>
      <p className="mt-2 text-gray-700">Showing product ID: {id}</p>
    </div>
  );
}
