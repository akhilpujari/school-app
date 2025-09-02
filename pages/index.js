import Link from "next/link"
export default function Home() {
  return (
    <div className="bg-black">
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Link href = '/AddSchools'>
      <button className="btn btn-black btn-outline-light rounded-3 p-3">Lets Get Started</button>
      </Link>
    </div>
    </div>
  )
}
