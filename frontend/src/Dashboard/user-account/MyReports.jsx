import { useState } from "react";
import { BASE_URL } from "../../config";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { toast } from "react-toastify";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import useFetchData from "../../hooks/useFetchData";

const MyReports = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    reportType: "",
    description: ""
  });

  const { data: reports, loading: reportsLoading, error, refetch } = 
    useFetchData(`${BASE_URL}/documents/reports`);

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reportURL = await uploadImageToCloudinary(selectedFile);

      const res = await fetch(`${BASE_URL}/documents/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          reportURL
        }),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      toast.success(message);
      setFormData({
        title: "",
        reportType: "",
        description: ""
      });
      setSelectedFile(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (reportsLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error errMessage={error} />;
  }

  return (
    <div className="max-w-[1170px] px-5 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
        {/* Upload Form */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Upload Medical Report</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
              >
                <option value="">Select Type</option>
                <option value="Lab Test">Lab Test</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI">MRI</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryColor focus:border-primaryColor"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Report
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primaryColor text-white py-2 px-4 rounded-md hover:bg-primaryDark transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Uploading..." : "Upload Report"}
            </button>
          </form>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-2xl font-bold mb-4">My Reports</h2>
          {reports?.length === 0 ? (
            <p className="text-gray-500">No reports uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {reports?.map((report) => (
                <div
                  key={report._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold">{report.title}</h3>
                  <p className="text-sm text-gray-500">Type: {report.reportType}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded on: {new Date(report.uploadDate).toLocaleDateString()}
                  </p>
                  {report.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {report.description}
                    </p>
                  )}
                  <a
                    href={report.reportURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-primaryColor hover:underline"
                  >
                    View Report
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReports; 