export default function Button({ children, type = 'button', onClick, disabled=false}) {
    return (
        <button
            className="Button"
            type={type}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}