var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
const Button = forwardRef((_a, ref) => {
    var { className, variant = "primary", size = "md", fullWidth = false, children } = _a, props = __rest(_a, ["className", "variant", "size", "fullWidth", "children"]);
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantStyles = {
        primary: "bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg focus:ring-orange-500",
        secondary: "bg-white/50 hover:bg-orange-50 text-orange-700 border border-orange-200 hover:border-orange-300 focus:ring-orange-500 backdrop-blur-sm",
        outline: "bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 focus:ring-gray-500",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    };
    const sizeStyles = {
        sm: "px-4 py-2 text-sm rounded-md",
        md: "px-6 py-2.5 text-sm rounded-lg",
        lg: "px-6 py-2.5 text-sm rounded-lg",
    };
    return (<button ref={ref} className={cn(baseStyles, variantStyles[variant], sizeStyles[size], fullWidth && "w-full", className)} {...props}>
                {children}
            </button>);
});
Button.displayName = "Button";
export default Button;
