import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

export default function AddingSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    if (!data.image || !data.image[0]) {
      toast.error('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('schoolName', data.schoolName);
    formData.append('email', data.email);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('contact', data.contact);
    formData.append('schoolImage', data.image[0]);

    try {
      const response = await fetch('/api/addschool', {
        method: 'POST',
        body: formData
      });

      let resData = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        resData = await response.json();
      } else {
        throw new Error('Server did not return JSON');
      }

      if (response.ok) {
        toast.success(resData.message || 'School added successfully!');
      } else {
        toast.error(resData.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong!');
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title">School Entry Form</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">School Name</label>
                    <input
                      {...register("schoolName", {
                        required: "* SchoolName is required",
                        minLength: { value: 4, message: "* Minimum length is 4 characters" },
                        maxLength: { value: 50, message: "* Maximum length is 50 characters" },
                      })}
                      type="text"
                      className="form-control"
                      placeholder="Enter school name"
                    />
                    {errors.schoolName && (
                      <small className="text-danger">{errors.schoolName.message}</small>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      {...register("email", {
                        required: "* Email is required",
                        pattern: {
                          value: /^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/,
                          message: "* Enter a valid email",
                        },
                      })}
                      type="email"
                      className="form-control"
                      placeholder="Enter school email"
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email.message}</small>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    {...register("address", { required: "* Address is required" })}
                    type="text"
                    className="form-control"
                    placeholder="Enter address"
                  />
                  {errors.address && (
                    <small className="text-danger">{errors.address.message}</small>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City</label>
                    <input
                      {...register("city", { required: "* City is required" })}
                      type="text"
                      className="form-control"
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <small className="text-danger">{errors.city.message}</small>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">State</label>
                    <select
                      {...register("state", { required: "* State is required" })}
                      className="form-select"
                    >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                    </select>
                    {errors.state && (
                      <small className="text-danger">{errors.state.message}</small>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      {...register("contact", {
                        required: "* Contact number is required",
                        pattern: { value: /^[0-9]{10}$/, message: "* Enter a valid 10-digit number" },
                      })}
                      type="tel"
                      className="form-control"
                      placeholder="Enter contact number"
                    />
                    {errors.contact && (
                      <small className="text-danger">{errors.contact.message}</small>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Profile Image</label>
                    <input
                      {...register("image", {
                        required: "* Image is required",
                        validate: {
                          lessThan2MB: (files) =>
                            files[0]?.size < 2 * 1024 * 1024 || "* Max size is 2MB",
                        },
                      })}
                      type="file"
                      accept="image/*"
                      className="form-control"
                    />
                    {errors.image && (
                      <small className="text-danger">{errors.image.message}</small>
                    )}
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button type="reset" className="btn btn-outline-secondary me-md-2">Reset</button>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
