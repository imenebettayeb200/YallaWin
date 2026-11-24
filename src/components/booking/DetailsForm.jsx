import TextField from "../auth/TextField";

/* DetailsForm — step 2 of the checkout: name, email and phone of the person who books. */
function DetailsForm({ details, errors, onChange }) {
  const change = (key, value) => {
    onChange({ ...details, [key]: value });
  };
  return (
    <div className="panel form-panel">
      <h2 className="panel-title">Your details</h2>
      <TextField
        label="Full name"
        value={details.name}
        error={errors.name}
        onChange={(e) => change("name", e.target.value)}
      ></TextField>
      <TextField
        label="Email (we send your tickets here)"
        type="email"
        value={details.email}
        error={errors.email}
        onChange={(e) => change("email", e.target.value)}
      ></TextField>
      <TextField
        label="Phone"
        type="tel"
        placeholder="+216 22 345 678"
        value={details.phone}
        error={errors.phone}
        onChange={(e) => change("phone", e.target.value)}
      ></TextField>
    </div>
  );
}

export default DetailsForm;
