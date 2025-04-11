import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/login");
    }, [navigate]);

    return (
        <>
            <h1>Redirecting...</h1>
        </>
    );
}

export default LandingPage;
