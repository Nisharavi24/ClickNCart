import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/service.css";

import { db, auth } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { generateServiceId } from "../../firebase/serviceUtils";

function RaiseService() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ NEW STATE
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    product: "",
    issueType: "",
    otherIssue: "",
    additionalInfo: "",
    preferredDate: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      // if user not logged in
      if (!currentUser) {

        // ✅ alert only when page first loads
        if (loading) {
          alert("Please login first!");
        }

        navigate("/login/user");
      } 
      else {
        setUser(currentUser);

        setFormData((prev) => ({
          ...prev,
          email: currentUser.email,
          name: currentUser.displayName || "",
        }));
      }

      // ✅ stop loading after first check
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, loading]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (formData.issueType === "Other" && !formData.otherIssue.trim()) {
      alert("Please describe your issue");
      return;
    }

    try {
      setSubmitting(true);

      const serviceId = await generateServiceId();

      const requestData = {
        ...formData,
        status: "Pending",
        userId: user.uid,
        serviceId,
      };

      await setDoc(doc(db, "services", serviceId), requestData);

      alert("Service request submitted successfully!");

      setTimeout(() => {
        setSubmitting(false);
        navigate("/my-services");
      }, 300);

    } catch (error) {
      console.error(error);
      alert("Failed to submit service request.");
      setSubmitting(false);
    }
  };

  const laptopIssues = [
    "Slow Performance",
    "Screen Flickering",
    "Battery Issue",
    "Other",
  ];

  const printerIssues = [
    "Not Working",
    "Paper Jam",
    "Ink Problem",
    "Other",
  ];

  const issueOptions =
    formData.product === "Laptop"
      ? laptopIssues
      : formData.product === "Printer"
      ? printerIssues
      : [];

  return (
    <>
      <Navbar />

      <div className="service-page">
        <div className="service-container">

          <div className="service-header">
            <h1>
              Raise <span>Service</span>
            </h1>
            <p>Submit a service request for laptops or printers</p>
          </div>

          <div className="service-card">

            {submitting ? (
              <div className="loader"></div>
            ) : (

              <form className="service-form" onSubmit={handleSubmit}>

                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                  />
                </div>

                <div>
                  <label>Contact Number</label>
                  <div className="contact-input">
                    <span className="country-code">🇮🇳 +91</span>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      pattern="[6-9][0-9]{9}"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label>Product Type</label>
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select product</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Printer">Printer</option>
                  </select>
                </div>

                <div>
                  <label>Issue Type</label>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select issue</option>
                    {issueOptions.map((issue, idx) => (
                      <option key={idx} value={issue}>
                        {issue}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.issueType === "Other" && (
                  <div className="full-width">
                    <label>Describe the issue</label>
                    <textarea
                      name="otherIssue"
                      value={formData.otherIssue}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                {formData.issueType !== "Other" && (
                  <div className="full-width">
                    <label>Additional Info (optional)</label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div>
                  <label>Preferred Service Date</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={today}
                    required
                  />
                </div>

                <div className="full-width">
                  <button type="submit" className="service-btn">
                    Submit Service Request
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>

    </>
  );
}

export default RaiseService;