import { Component, ErrorInfo, PropsWithChildren } from "react";

type TErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<PropsWithChildren, TErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): TErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h4
          style={{
            width: "100vw",
            height: "100dvh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Something went wrong.
        </h4>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
