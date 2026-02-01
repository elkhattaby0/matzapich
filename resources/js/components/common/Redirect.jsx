import { Link } from "react-router-dom";

export default function Redirect ({ path, children }) {
    return (
        <div className="Redirect">
            <Link to={path}>{children}</Link>
        </div>
    )
}