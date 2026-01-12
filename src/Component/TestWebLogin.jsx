import React from "react";
import { useNavigate } from "react-router";
import { Loader } from "./componetUi/Loader";

export function TestWebLogin() {
    const navigate = useNavigate();
    const urlToken = new URLSearchParams(window.location.search).get("token");
    console.log(urlToken);

    React.useEffect(() => {
        if (!urlToken || urlToken === null || urlToken === "null" || urlToken === '') {
            navigate('/');
        } else {
            if (localStorage.getItem("Token")) {
                if (localStorage.getItem("Token") == urlToken) {
                    navigate("/setting-client");
                } else {
                    localStorage.setItem("Token", urlToken);
                    navigate("/setting-client");
                }
            } else {
                localStorage.setItem("Token", urlToken);
                navigate("/setting-client");
            }
        }
    }, [navigate, urlToken]);
    return (<>
        <div style={{ height: "100vh", width: "100vw" }}>
            <Loader />
        </div>

    </>);
}