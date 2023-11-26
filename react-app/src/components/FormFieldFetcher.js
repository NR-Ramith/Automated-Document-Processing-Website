import React, { useEffect, useState } from 'react';

const FormFieldFetcher = () => {
  const [formFields, setFormFields] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdX7VTdsVsNeFu3GPxNcRAP6dziAaeXzZyYjHaXLgIDf_kuPQ/viewform?usp=sf_link';

const response = await fetch(`${corsProxyUrl}${targetUrl}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch form. Status: ${response.status}`);
        }

        const html = await response.text();
        console.log(html);

        // Parse HTML and find form fields using DOM API
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const formFields = doc.querySelectorAll('form input, form select, form textarea');

        // Extract field names or other attributes
        const fieldNames = Array.from(formFields).map(element => element.name || element.id);

        setFormFields(fieldNames);
      } catch (error) {
        console.error('Error fetching form:', error);
        setError(error.message || 'An error occurred while fetching the form.');
      }
    };

    fetchFormFields();
  }, []); // Run once on component mount

  return (
    <div>
      <h2>Form Fields</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {formFields.map((fieldName, index) => (
            <li key={index}>{fieldName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormFieldFetcher;
