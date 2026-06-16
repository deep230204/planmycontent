import PremiumInput from "./PremiumInput";
import PasswordChecklist from "./PasswordChecklist";
import { Lock } from "lucide-react";

function PasswordField({
  value,
  onChange,
  name = "password",
  label = "Password",
  placeholder = "Create password",
  required = true,
  error,
  showChecklist = true,
}) {
  return (
    <div>
      <PremiumInput
        label={label}
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon={Lock}
        isPassword
        required={required}
        error={error}
      />
      {showChecklist && value && <PasswordChecklist password={value} />}
    </div>
  );
}

export default PasswordField;
