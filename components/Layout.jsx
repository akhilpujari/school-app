import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#">SchoolsData</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                  Manage Schools
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/AddSchools" className="dropdown-item">
                      Add School
                    </Link>
                  </li>
                  <li>
                    <Link href="/ShowSchools" className="dropdown-item">
                      Show Schools
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        {children}
      </main>
    </>
  );
}
