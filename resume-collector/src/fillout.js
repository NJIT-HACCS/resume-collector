import React, { useEffect, useState } from "react";
import uploadFile from './uploadFile';
import "./styles/fillout.css";

const DetailForm = () => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const scriptURL = "https://script.google.com/macros/s/AKfycby2pIgGKpNyRHI1qCc6SvtARkA1b_5fOsd-kRd-zT2seGtQLRNLqa4WqtTN1uS-KVKK/exec";
    const form = document.forms["submit-to-google-sheet"];

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!file) {
        setFileError("Please upload a PDF file");
        return;
      }

      try {
        // Upload to S3 and get the URL
        const resumeS3Url = await uploadFile(file);

        // Create a hyperlink formula for Google Sheets
        const hyperlinkFormula = `${resumeS3Url}`;

        // Prepare form data for Google Sheets
        const formData = new FormData(form);
        formData.append("resumeS3Url", hyperlinkFormula); // Add hyperlink formula to form data

        // Submit to Google Sheets
        const response = await fetch(scriptURL, { method: "POST", body: formData });

        const data = await response.json();

        if (data.result === 'success') {
          setMsg(data.message || "Form submitted successfully!");
        } else {
          throw new Error(data.message || "An error occurred");
        }

        form.reset();
        setFile(null);
        setFileError("");
      } catch (error) {
        console.error("Error:", error.message);
        setMsg("Error submitting form or uploading file. Please try again.");
      } finally {
        setTimeout(() => {
        setMsg("");
      }, 5000);
    }
};

    //     msg.innerHTML = "Form submitted and file uploaded successfully!";
    //     console.log(msg.innerHTML);
    //     form.reset();
    //     setFile(null);
    //     setFileError("");
    //   } catch (error) {
    //     console.error("Error:", error.message);
    //     msg.innerHTML = "Error submitting form or uploading file. Please try again.";
    //   } finally {
    //     setTimeout(() => {
    //       msg.innerHTML = "";
    //     }, 5000);
    //   }
    // };

    if (form) {
      form.addEventListener("submit", handleSubmit);
    }

    return () => {
      if (form) {
        form.removeEventListener("submit", handleSubmit);
      }
    };
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileError("");
    } else {
      setFile(null);
      setFileError("Please select a PDF file");
    }
  };

  return (
    <>
      <h2> Submit your resume here to be added to our resume database! </h2>
      <div className="form-container">
        <form name="submit-to-google-sheet">
          <input type="text" name="firstname" placeholder="First Name" required />
          <input type="text" name="lastname" placeholder="Last Name" required />
          <input type="text" name="ucid" placeholder="UCID" required />
          <input type="email" name="email" placeholder="Your E-mail" required />
          <input 
            type="file" 
            name="resumeS3Url" 
            onChange={handleFileChange} 
            accept=".pdf" 
            required 
          />
          {fileError && <p className="error-message">{fileError}</p>}
          <div className="submission">
            <button type="submit" className="btn">Submit</button>
          </div>
        </form>
        {msg && <div className="message">{msg}</div>}
      </div>
    </>
  );
};

export default DetailForm;