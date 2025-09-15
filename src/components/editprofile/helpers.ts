export const getColorClasses = (color: string, isSelected: boolean) => {
    if (!isSelected) {
        return "bg-slate-900 text-orange-300 border-2 border-orange-400/60 hover:border-orange-300 hover:text-orange-200";
    }

    // Use hex colors directly for selected state
    return `border-2 border-opacity-70 transition-all duration-200`;
};

export const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "";

    const digits = phoneNumber.replace(/\D/g, "");

    let formattedValue = "";
    if (digits.length > 0) {
        if (digits.length <= 3) {
            formattedValue = digits;
        } else if (digits.length <= 6) {
            formattedValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
        } else {
            formattedValue = `${digits.slice(0, 3)}-${digits.slice(
                3,
                6
            )}-${digits.slice(6, 10)}`;
        }
    }
    return formattedValue;
};
