import { useTranslation } from "react-i18next";

const ErrorPage = () => {
    const {t} = useTranslation()
    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "10px" , color:"red"}}>{t("notfoundTitle")}</h1>
                <p style={{ fontSize: "1.2rem" }}>{t("notfoundMessga")}</p>
            </div>
        </div>
    );
}

export default ErrorPage;
