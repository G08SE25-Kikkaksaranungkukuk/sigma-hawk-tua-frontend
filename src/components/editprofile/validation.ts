export const validateForm = (formData: any, setValidationErrors: any) => {
    const errors = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        interests: "",
        travelStyle: "",
    };

    if (!formData.firstName || formData.firstName.trim() === "") {
        errors.firstName = "First name is required";
    }

    if (!formData.lastName || formData.lastName.trim() === "") {
        errors.lastName = "Last name is required";
    }

    const phoneRegex = /^0\d{2}-\d{3}-\d{4}$/;
    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
        errors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
        errors.phoneNumber = "Phone number must be in format 0xx-xxx-xxxx";
    }

    if (formData.interests.length === 0) {
        errors.interests = "Please select at least 1 interest";
    }

    if (formData.travelStyle.length === 0) {
        errors.travelStyle = "Please select at least 1 travel style";
    }

    setValidationErrors(errors);

    return Object.values(errors).every((error) => error === "");
};

export const isFormValid = (formData: any) => {
    return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.phoneNumber.trim() !== "" &&
        /^0\d{2}-\d{3}-\d{4}$/.test(formData.phoneNumber) &&
        formData.interests.length > 0 &&
        formData.travelStyle.length > 0
    );
};