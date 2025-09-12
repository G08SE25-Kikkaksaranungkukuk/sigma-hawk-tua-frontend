export const getColorClasses = (color: string, isSelected: boolean) => {
    if (!isSelected) {
        return "bg-slate-900 text-orange-300 border-2 border-orange-400/60 hover:border-orange-300 hover:text-orange-200";
    }

    const colorMap: { [key: string]: string } = {
        green: "bg-green-200/25 text-green-300 border-2 border-green-400/70",
        red: "bg-red-200/25 text-red-300 border-2 border-red-400/70",
        purple: "bg-purple-200/25 text-purple-300 border-2 border-purple-400/70",
        blue: "bg-blue-200/25 text-blue-300 border-2 border-blue-400/70",
        cyan: "bg-cyan-200/25 text-cyan-300 border-2 border-cyan-400/70",
        slate: "bg-slate-200/25 text-slate-300 border-2 border-slate-400/70",
        amber: "bg-amber-200/25 text-amber-300 border-2 border-amber-400/70",
        yellow: "bg-yellow-200/25 text-yellow-300 border-2 border-yellow-400/70",
        teal: "bg-teal-200/25 text-teal-300 border-2 border-teal-400/70",
        pink: "bg-pink-200/25 text-pink-300 border-2 border-pink-400/70",
        indigo: "bg-indigo-200/25 text-indigo-300 border-2 border-indigo-400/70",
        emerald: "bg-emerald-200/25 text-emerald-300 border-2 border-emerald-400/70",
        violet: "bg-violet-200/25 text-violet-300 border-2 border-violet-400/70",
        sky: "bg-sky-200/25 text-sky-300 border-2 border-sky-400/70",
        orange: "bg-orange-200/25 text-orange-300 border-2 border-orange-400/70",
        rose: "bg-rose-200/25 text-rose-300 border-2 border-rose-400/70",
    };

    return (
        colorMap[color] ||
        "bg-orange-200/25 text-orange-300 border-2 border-orange-400/70"
    );
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
            formattedValue = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
    }
    return formattedValue;
};