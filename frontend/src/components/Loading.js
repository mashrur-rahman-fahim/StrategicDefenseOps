"use client";
import { Spinner } from "react-bootstrap";

const Loading = ({ text }) => {
    return (
        <div
            className="d-flex justify-content-center align-items-center gap-2"
            style={{ height: "100vh" }}
        >
            <Spinner animation="grow" variant="primary" role="status" />
            {text && <span>{text}</span>}
        </div>
    );
}

export default Loading;
