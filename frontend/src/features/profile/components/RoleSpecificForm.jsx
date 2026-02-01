import PoliceProfile from "./roles/PoliceProfile";
import DoctorProfile from "./roles/DoctorProfile";
import FemaleProfile from "./roles/FemaleProfile";
import ParentProfile from "./roles/ParentProfile";

export default function RoleSpecificForm({ role, formData, handleChange }) {
  switch (role) {
    case "police":
      return <PoliceProfile formData={formData} handleChange={handleChange} />;
    case "doctor":
      return <DoctorProfile formData={formData} handleChange={handleChange} />;
    case "female":
      return <FemaleProfile formData={formData} handleChange={handleChange} />;
    case "parent":
      return <ParentProfile formData={formData} handleChange={handleChange} />;
    default:
      return (
        <div className="text-muted-foreground p-4">
          Please select a role to see specific settings.
        </div>
      );
  }
}
