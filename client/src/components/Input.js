export const Input = ({ label, type, id, name, value, placeholder = '', onChange }) => (
    <div className='label-input'>
        <label htmlFor={id} className="label">{label}</label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
    </div>
);
