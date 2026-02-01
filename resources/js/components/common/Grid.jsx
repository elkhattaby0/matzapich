export default function Grid({ children, nbr = 1, gap="20px" }) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${nbr}, 1fr)`,
                gap: gap
            }}
        >
            {children}
        </div>
    )
}