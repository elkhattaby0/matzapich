export default function Select({ label, name,value, onChange, placeholder="Select...", options = [] }) {
    return (
        <div className="Select">
            {label && <label>{label}</label>}
            <select 
                name={name}
                value={value}
                onChange={onChange}
            >
                {placeholder && <option value=''>{placeholder}</option>}
                {
                    options.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                    ))
                }
            </select>
        </div>
    )
}