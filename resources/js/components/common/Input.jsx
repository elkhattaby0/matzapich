export default function Input({ 
    type = 'text', 
    name, 
    value, 
    onChange, 
    placeholder, 
    label
}) {
    return (
        <div className="Input">
            {label && <label>{label}</label>}
            <input 
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}