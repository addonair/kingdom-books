import { useParams } from 'react-router-dom'

function ProductPage() {
  const { id } = useParams()
  return <h1 className="text-3xl font-bold p-8">ProductPage — {id}</h1>
}

export default ProductPage
