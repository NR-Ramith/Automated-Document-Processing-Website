const questions = {
    2: [
      { id: 1, text: 'What is your title?', field: 'personalTitle-2', fieldLength: 4, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 2, text: 'What is your first name?', field: 'personalFirstName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 3, text: 'What is your middle name?', field: 'personalMiddleName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 4, text: 'What is your last name?', field: 'personalLastName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },

      { id: 5, text: 'What is your maiden title?', field: 'maidenTitle-2', fieldLength: 4, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 6, text: 'What is your maiden first name?', field: 'maidenFirstName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 7, text: 'What is your maiden middle name?', field: 'maidenMiddleName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 8, text: 'What is your maiden last name?', field: 'maidenLastName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },

      { id: 9, text: 'What is your spouse title?', field: 'spouseTitle-2', fieldLength: 4, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 10, text: 'What is your spouse first name?', field: 'spouseFirstName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 11, text: 'What is your spouse middle name?', field: 'spouseMiddleName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 12, text: 'What is your spouse last name?', field: 'spouseLastName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },

      { id: 13, text: 'What is your father title?', field: 'fatherTitle-2', fieldLength: 4, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 14, text: 'What is your father first name?', field: 'fatherFirstName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 15, text: 'What is your father middle name?', field: 'fatherMiddleName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 16, text: 'What is your father last name?', field: 'fatherLastName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },

      { id: 17, text: 'What is your mother title?', field: 'motherTitle-2', fieldLength: 4, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 18, text: 'What is your mother first name?', field: 'motherFirstName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 19, text: 'What is your mother middle name?', field: 'motherMiddleName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      { id: 20, text: 'What is your mother last name?', field: 'motherLastName-2', fieldLength: 11, callValidations: ['onlyAlphabets','maxLength'] },
      {
        id: 21,
        text: 'Select your gender',
        field: 'gender-2',
        // mandatory: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'transgender', label: 'Transgender' }
        ]
      },
      { id: 22, text: 'What is your date of birth? Speak the date in this format - YYYY dash MM dash DD', field: 'dob-2', fieldLength: 10, callValidations: ['fixedLength','dateFormat','validDate'] },
      { id: 23, text: 'What is your place of birth?', field: 'birthPlace-2', fieldLength: 13, callValidations: ['onlyAlphabets','maxLength','makeTitle'] },
      { id: 24, text: 'What is your country of birth?', field: 'birthCountry-2', fieldLength: 13, callValidations: ['onlyAlphabets','maxLength','makeTitle'] },
      {
        id: 25,
        text: 'Choose your resedential status',
        field: 'resedentialStatus-2',
        options: [
          { value: 'residentialIndian', label: 'Resident Indian' },
          { value: 'nonResidentialIndian', label: 'Non Resident Indian' },
          { value: 'foreignNational', label: 'Foreign National' },
          { value: 'indianOrigin', label: 'Person of Indian Origin' }
        ]
      },
      {
        id: 26,
        text: 'Pick your martial status',
        field: 'martialStatus-2',
        options: [
          { value: 'm', label: 'M' },
          { value: 'u', label: 'U' },
          { value: 'o', label: 'O' }
        ]
      },
      {
        id: 27,
        text: 'Are you ex-service man?',
        field: 'exServiceMan-2',
        options: [
          { value: 'y', label: 'Yes' },
          { value: 'n', label: 'No' }
        ]
      },
      {
        id: 28,
        text: 'Are you physically/visually handicapped?',
        field: 'handicapped-2',
        options: [
          { value: 'y', label: 'Yes' },
          { value: 'n', label: 'No' }
        ]
      },
      {
        id: 29,
        text: 'Form 60',
        field: 'form60-2',
        options: [
          { value: 'form60', label: '' }
        ]
      },
      { id: 30, text: 'Enter your PAN No.', field: 'panNumber-2', fieldLength: 10, callValidations: ['fixedLength'] },
      { id: 31, text: 'Enter your Aadhar No.', field: 'aadharNumber-2', fieldLength: 12, callValidations: ['fixedLength','onlyDigits'] },
      {
        id: 32,
        text: 'Pick your Occupation',
        field: 'martialStatus-2',
        options: [
          { value: 'business', label: 'Business' },
          { value: 'professional', label: 'Professional' },
          { value: 'service', label: 'Service' },
          { value: 'student', label: 'Student' },
          { value: 'agriculture', label: 'Agriculture' },
          { value: 'others', label: 'Others' }
        ]
      },
      { id: 33, text: 'What is your education?', field: 'education-2', fieldLength: 8, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 34, text: 'What is your nationality?', field: 'nationality-2', fieldLength: 6, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 35, text: 'What is your religion?', field: 'religion-2', fieldLength: 8, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 36, text: 'What is your caste?', field: 'caste-2', fieldLength: 8, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 37, text: 'Name of Employer / Profession / Nature of Business / Industry', field: 'employer-2', fieldLength: 23, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      {
        id: 38,
        text: 'Please tick, if your residence address is same as communication address, otherwise please provide your residence address below.',
        field: 'sameResidenceAddress-2',
        options: [
          { value: 'sameResidenceAddress', label: '' }
        ]
      },

      { id: 39, text: 'What is your residence address?', field: 'residenceAddress-2', fieldLength: 58, callValidations: ['maxLength','onlyAlphabets'] },
      { id: 40, text: 'What is your residence city?', field: 'residenceCity-2', fieldLength: 10, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 41, text: 'What is your residence district?', field: 'residenceDistrict-2', fieldLength: 16, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 42, text: 'What is your residence state?', field: 'residenceState-2', fieldLength: 8, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 43, text: 'What is your residence country?', field: 'residenceCountry-2', fieldLength: 7, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 44, text: 'What is your residence pin?', field: 'residencePin-2', fieldLength: 6, callValidations: ['fixedLength','onlyDigits'] },
      { id: 45, text: 'What is your residence phone No.?', field: 'residencePhoneNo-2', fieldLength: 11, callValidations: ['maxLength','onlyDigits'] },
      { id: 46, text: 'What is your residence mobile No.?', field: 'residenceMobileNo-2', fieldLength: 11, callValidations: ['maxLength','onlyDigits'] },
      { id: 47, text: 'What is your residence Email ID?', field: 'residenceEmailId-2', fieldLength: 34, callValidations: ['maxLength','validEmail'] },

      {
        id: 48,
        text: 'Pick your address type',
        field: 'addressType-2',
        options: [
          { value: 'residentialBusiness', label: 'Residential/Business' },
          { value: 'residential', label: 'Residential' },
          { value: 'business', label: 'Business' },
          { value: 'registeredOffice', label: 'Registered Office' },
          { value: 'unspecified', label: 'Unspecified' }
        ]
      },
      {
        id: 49,
        text: 'Please tick, if your permanent address is same as residential address, otherwise please provide your permanent address below.',
        field: 'samePermanentAddress-2',
        options: [
          { value: 'samePermanentAddress', label: '' }
        ]
      },

      { id: 39, text: 'What is your permanent address?', field: 'permanentAddress-2', fieldLength: 58, callValidations: ['maxLength','onlyAlphabets'] },
      { id: 40, text: 'What is your permanent city?', field: 'permanentCity-2', fieldLength: 10, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 41, text: 'What is your permanent district?', field: 'permanentDistrict-2', fieldLength: 16, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 42, text: 'What is your permanent state?', field: 'permanentState-2', fieldLength: 8, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 43, text: 'What is your permanent country?', field: 'permanentCountry-2', fieldLength: 7, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 44, text: 'What is your permanent pin?', field: 'permanentPin-2', fieldLength: 6, callValidations: ['fixedLength','onlyDigits'] },
      { id: 45, text: 'What is your permanent phone No.?', field: 'permanentPhoneNo-2', fieldLength: 11, callValidations: ['maxLength','onlyDigits'] },
      { id: 46, text: 'What is your permanent mobile No.?', field: 'permanentMobileNo-2', fieldLength: 11, callValidations: ['maxLength','onlyDigits'] },
      
      {
        id: 47,
        text: 'What is your annual family income?',
        field: 'familyIncome-2',
        options: [
          { value: 'below50000', label: 'Below 50,000' },
          { value: '50000to100000', label: '50,000 -< 1Lac' },
          { value: '100000to500000', label: '1Lac -< 5Lacs' },
          { value: '500000to1000000', label: '5Lacs -< 10Lacs' },
          { value: '1000000to2500000', label: '10Lacs -< 25Lacs' },
          { value: '2500000to5000000', label: '25Lacs -< 50Lacs' },
          { value: '5000000to10000000', label: '50Lacs -< 1Cr' },
          { value: 'above10000000', label: 'Above 1Cr' }
        ]
      },
      {
        id: 48,
        text: 'What is your net worth?',
        field: 'netWorth-2',
        options: [
          { value: 'below1000000', label: 'Below 10Lacs' },
          { value: '1000000to10000000', label: '10Lacs -< 1Cr' },
          { value: '10000000to50000000', label: '1Cr -< 5Cr' },
          { value: 'above50000000', label: 'Above 5Cr' }
        ]
      },
      {
        id: 49,
        text: 'Pick your source of income',
        field: 'incomeSource-2',
        options: [
          { value: 'salaryPension', label: 'Salary/Pension' },
          { value: 'housePropertyRental', label: 'House Property/Rental' },
          { value: 'businessProfession', label: 'Business/Profession' },
          { value: 'investments', label: 'Investments' },
          { value: 'others', label: 'Others' }
        ]
      },
      { id: 50, text: 'Enter your document identification no. for identity proof', field: 'identityProofDocId', fieldLength: 12, callValidations: ['maxLength','onlyDigits'] },
      { id: 51, text: 'Who is the issuing authority?', field: 'identityProofAuthority', fieldLength: 9, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 52, text: 'Where is the place of issue?', field: 'identityProofIssuePlace', fieldLength: 9, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 53, text: 'When is the expiry date? Speak the date in this format - YYYY dash MM dash DD', field: 'identityProofExpiryDate', fieldLength: 10, callValidations: ['fixedLength','dateFormat','validDate'] },

      { id: 54, text: 'Enter your document identification no. for residence proof', field: 'residenceProofDocId', field: 'identityProofDocId', fieldLength: 12, callValidations: ['maxLength','onlyDigits'] },
      { id: 55, text: 'Who is the issuing authority?', field: 'residenceProofAuthority', fieldLength: 9, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 56, text: 'Where is the place of issue?', field: 'residenceProofIssuePlace', fieldLength: 9, callValidations: ['maxLength','onlyAlphabets','makeTitle'] },
      { id: 57, text: 'When is the expiry date? Speak the date in this format - YYYY dash MM dash DD', field: 'residenceProofExpiryDate', fieldLength: 10, callValidations: ['fixedLength','dateFormat','validDate'] },

      {
        id: 58,
        text: 'Information on Credit Facilities Availed',
        field: 'enjoyCredit',
        options: [
          { value: 'doNotEnjoyCredit', label: 'I do not enjoy credit facility with Union Bank/other bank' },
          { value: 'enjoyCredit', label: 'I enjoy credit facility with Union Bank/other bank' }
        ]
      },
      {
        id: 59,
        text: 'The details of credit are under..?',
        field: 'creditUnder',
        last: true,
        options: [
          { value: 'vehicleLoan', label: 'Vehicle Loan' },
          { value: 'houseingLoan', label: 'Housing Loan' },
          { value: 'consumerLoan', label: 'Consumer Loan' },
          { value: 'educationalLoan', label: 'Educational Loan' },
          { value: 'businessLoan', label: 'Business Loan' },
          { value: 'creditCard', label: 'Credit Card' }
        ]
      },
    ],
    4: [
      { id: 1, text: 'What is your name?', field: 'name', mandatory: true, callValidations: ['onlyAlphabets','makeTitle'] },
      { id: 2, text: 'What is your personal number?', field: 'personalNumber', mandatory: true, fieldLength: 10, callValidations: ['onlyDigits','fixedLength'] },
      { id: 16, text: 'What is your email address?', field: 'email', callValidations: ['validEmail'] },
      { id: 3, text: "What is your father's name?", field: 'fatherName', callValidations: ['onlyAlphabets'] },
      { id: 4, text: "What is your father's number?", field: 'fatherNumber', fieldLength: 10, callValidations: ['onlyDigits','fixedLength'] },
      { id: 5, text: "What is your mother's name?", field: 'motherName', callValidations: ['onlyAlphabets'] },
      { id: 6, text: "What is your mother's number?", field: 'motherNumber', fieldLength: 10, callValidations: ['onlyDigits','fixedLength'] },
      { id: 7, text: "What is your guardian's name?", field: 'guardianName', callValidations: ['onlyAlphabets'] },
      { id: 8, text: "What is your guardian's number?", field: 'guardianNumber', fieldLength: 10, callValidations: ['onlyDigits','fixedLength'] },
      { id: 9, text: 'What is your date of birth? Speak the date in this format - YYYY dash MM dash DD', field: 'dob', fieldLength: 10, callValidations: ['fixedLength','dateFormat','validDate'] },
      { id: 10, text: 'What is the current date? Speak the date in this format - YYYY dash MM dash DD', field: 'date', fieldLength: 10, callValidations: ['fixedLength','dateFormat','validDate'] },
      { id: 12, text: 'What is your city?', field: 'city', callValidations: ['onlyAlphabets'] },
      { id: 13, text: 'What is your state?', field: 'state', callValidations: ['onlyAlphabets'] },
      { id: 14, text: 'What is your nationality?', field: 'nationality', callValidations: ['onlyAlphabets'] },
      { id: 15, text: 'What is your pin code?', field: 'pinCode', fieldLength: 6, callValidations: ['onlyDigits','fixedLength'] },
      { id: 11, text: 'What is your address?', field: 'address', last:true },
    ],
  };

export default questions;