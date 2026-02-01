import FirstHeading from "../../components/common/FirstHeading";

export default function AuthLayout({children, title}) {

    return (
        <div className="AuthLayout">
            <FirstHeading>{title}</FirstHeading>
            <div>
                {children}
            </div>
        </div>
    )
}