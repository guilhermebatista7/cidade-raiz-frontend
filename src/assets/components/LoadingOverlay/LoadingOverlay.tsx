import { useLoading } from "../../../contexts/LoadingContext";
import "./LoadingOverlay.css";

export function LoadingOverlay() {
    const { carregando } = useLoading();

    if (!carregando) {
        return null;
    }

    return (
        <div className="loadingOverlay">
            <div className="loadingBox">
                <div className="spinner"></div>
                <span>Carregando...</span>
            </div>
        </div>
    );
}
