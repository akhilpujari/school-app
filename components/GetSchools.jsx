import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function GetSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/getSchools');
      const data = await response.json();
      
      if (response.ok) {
        setSchools(data.schools);
      } else {
        toast.error('Failed to fetch schools');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  if (loading) return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-center text-primary fw-bold mb-3">Our Schools</h2>
          <p className="text-center text-muted">Discover amazing educational institutions</p>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {schools.map(school => (
          <div key={school.id} className="col">
            <div className="card h-100 shadow-sm border-0 transition-scale">
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img 
                  src={school.imageUrl} 
                  alt={school.name}
                  className="card-img-top h-100 object-fit-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/f8f9fa/6c757d?text=School+Image';
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title text-dark fw-bold mb-2 text-truncate">{school.name}</h5>
                
                <div className="mb-2">
                  <small className="text-muted">
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    <span className="text-truncate d-inline-block" style={{maxWidth: '100%'}}>
                      {school.address}
                    </span>
                  </small>
                </div>
                <div className="mb-2">
                  <span className="badge bg-light text-dark border">
                    <i className="bi bi-building me-1"></i>
                    {school.city}, {school.state}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {schools.length === 0 && (
        <div className="row mt-5">
          <div className="col-12 text-center">
            <div className="py-5">
              <i className="bi bi-building-x display-1 text-muted"></i>
              <h4 className="mt-3 text-muted">No Schools Found</h4>
              <p className="text-muted">Be the first to add a school to our platform!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}